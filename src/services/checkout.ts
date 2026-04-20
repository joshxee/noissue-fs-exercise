import { db } from '../db/db';
import { cartItems, shippingFees, purchaseOrders, purchaseOrderItems, products, suppliers } from '../db/schema';

export async function processCheckout() {
  // 1. Fetch all cart items
  const allCartItems = db.select().from(cartItems).all();

  // 2. Fetch all shipping fees
  const allShippingFees = db.select().from(shippingFees).all();

  // 3. Fetch products and suppliers for enriching the PO response
  const allProducts = db.select().from(products).all();
  const allSuppliers = db.select().from(suppliers).all();
  const productMap = new Map(allProducts.map(p => [p.sku, p]));
  const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

  // 4. Group cart items by supplier
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

    const dbItems = items.map(item => ({
      poId,
      productSku: item.productSku,
      quantity: item.quantity,
      total: item.total,
    }));

    if (dbItems.length > 0) {
      db.insert(purchaseOrderItems).values(dbItems).execute();
    }

    const enrichedItems = items.map(item => ({
      poId,
      productSku: item.productSku,
      quantity: item.quantity,
      total: item.total,
      productName: productMap.get(item.productSku)?.name ?? item.productSku,
      productType: productMap.get(item.productSku)?.type ?? 'Stocked',
    }));

    generatedPOs.push({
      poId,
      supplierId,
      supplierName: supplierMap.get(supplierId)?.name ?? supplierId,
      items: enrichedItems,
      itemTotal,
      shippingFee,
      orderTotal,
      currency,
      symbol,
    });
  }

  return generatedPOs;
}
