import { db, sqlite } from '../db/db';
import { cartItems, shippingFees, purchaseOrders, purchaseOrderItems, products, suppliers } from '../db/schema';

type GeneratedPO = {
  poId: number;
  supplierId: string;
  supplierName: string;
  items: {
    poId: number;
    productSku: string;
    quantity: number;
    total: number;
    productName: string;
    productType: string;
  }[];
  itemTotal: number;
  shippingFee: number;
  orderTotal: number;
  currency: string;
  symbol: string;
};

// Returns null when the cart is empty (already checked out or never populated).
export function processCheckout(): GeneratedPO[] | null {
  const run = () => {
    const allCartItems = db.select().from(cartItems).all();
    if (allCartItems.length === 0) return null;

    const allShippingFees = db.select().from(shippingFees).all();
    const allProducts = db.select().from(products).all();
    const allSuppliers = db.select().from(suppliers).all();
    const productMap = new Map(allProducts.map(p => [p.sku, p]));
    const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

    const itemsBySupplier = allCartItems.reduce<Map<string, typeof allCartItems>>(
      (acc, item) => {
        const existing = acc.get(item.supplierId) ?? [];
        return acc.set(item.supplierId, [...existing, item]);
      },
      new Map()
    );

    const generatedPOs: GeneratedPO[] = [];

    for (const [supplierId, items] of itemsBySupplier.entries()) {
      const itemTotal = items.reduce((sum, item) => sum + item.total, 0);
      const feeRecord = allShippingFees.find(f => f.supplierId === supplierId);
      const shippingFee = feeRecord ? feeRecord.total : 0;
      const currency = items[0]?.currency ?? 'NZD';
      const symbol = items[0]?.symbol ?? '$';
      const orderTotal = itemTotal + shippingFee;

      const poResult = db.insert(purchaseOrders).values({
        supplierId,
        itemTotal,
        shippingFee,
        orderTotal,
        currency,
        symbol,
      }).returning({ insertedId: purchaseOrders.id }).get();

      const poId = poResult.insertedId;

      const dbItems = items.map(item => ({
        poId,
        productSku: item.productSku,
        quantity: item.quantity,
        total: item.total,
      }));

      db.insert(purchaseOrderItems).values(dbItems).execute();

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

    db.delete(cartItems).run();
    return generatedPOs;
  };

  // Wrap in a SQLite transaction so concurrent duplicate requests can't both
  // read a non-empty cart and produce duplicate purchase orders.
  return sqlite.transaction(run)();
}
