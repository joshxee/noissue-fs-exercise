import { db } from '../db/db';
import { cartItems, shippingFees, purchaseOrders, purchaseOrderItems } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function processCheckout() {
  // 1. Fetch all cart items
  const allCartItems = db.select().from(cartItems).all();
  
  // 2. Fetch all shipping fees
  const allShippingFees = db.select().from(shippingFees).all();

  // 3. Group cart items by supplier
  const itemsBySupplier = new Map<string, typeof allCartItems>();
  for (const item of allCartItems) {
    if (!itemsBySupplier.has(item.supplierId)) {
      itemsBySupplier.set(item.supplierId, []);
    }
    itemsBySupplier.get(item.supplierId)!.push(item);
  }

  const generatedPOs = [];

  // 4. Generate Purchase Orders
  for (const [supplierId, items] of itemsBySupplier.entries()) {
    // Calculate item total
    const itemTotal = items.reduce((sum, item) => sum + item.total, 0);
    
    // Find shipping fee
    const feeRecord = allShippingFees.find(f => f.supplierId === supplierId);
    const shippingFee = feeRecord ? feeRecord.total : 0;
    
    const currency = items[0]?.currency || 'NZD';
    const symbol = items[0]?.symbol || '$';

    const orderTotal = itemTotal + shippingFee;

    // 5. Save to database
    const poResult = db.insert(purchaseOrders).values({
      supplierId,
      itemTotal,
      shippingFee,
      orderTotal,
      currency,
      symbol
    }).returning({ insertedId: purchaseOrders.id }).get();

    const poId = poResult.insertedId;

    const poItems = items.map(item => ({
      poId,
      productSku: item.productSku,
      quantity: item.quantity,
      total: item.total
    }));

    if (poItems.length > 0) {
      db.insert(purchaseOrderItems).values(poItems).execute();
    }

    generatedPOs.push({
      poId,
      supplierId,
      items: poItems,
      itemTotal,
      shippingFee,
      orderTotal,
      currency,
      symbol
    });
  }

  return generatedPOs;
}
