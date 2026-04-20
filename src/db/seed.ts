import { readFileSync } from 'fs';
import { resolve } from 'path';
import { db, initDb } from './db';
import { suppliers, products, cartItems, shippingFees } from './schema';

export function seedDatabase() {
  initDb();

  const cartPath = resolve(process.cwd(), 'cart.json');
  const cartData = JSON.parse(readFileSync(cartPath, 'utf8'));

  // Normalize supplier IDs (e.g., '0001' vs '00001') to a standard format
  // We'll just strip leading zeros to normalize
  const normalizeSupplierId = (id: string) => id.replace(/^0+/, '');

  // 1. Extract unique suppliers
  const supplierMap = new Map<string, { id: string; name: string }>();
  for (const item of cartData.products) {
    const rawId = item.supplier.supplierId;
    const normId = normalizeSupplierId(rawId);
    if (!supplierMap.has(normId)) {
      supplierMap.set(normId, { id: normId, name: item.supplier.supplierName });
    }
  }

  // Insert suppliers
  for (const supplier of supplierMap.values()) {
    // Upsert or insert if not exists (we just insert since DB is in-memory and fresh)
    db.insert(suppliers).values(supplier).execute();
  }

  // 2. Insert products and cart items
  for (const item of cartData.products) {
    const normId = normalizeSupplierId(item.supplier.supplierId);
    
    // We only insert unique products, but assuming SKU is unique in the cart
    db.insert(products).values({
      sku: item.productSku,
      type: item.productType,
      name: item.productName,
      description: item.productDescription,
    }).onConflictDoNothing().execute(); // Actually SQLite in bun doesn't natively support onConflictDoNothing in drizzle without SQLite specifically handled, but let's just use try-catch or assume unique.
    
    // Cart item
    db.insert(cartItems).values({
      productSku: item.productSku,
      supplierId: normId,
      quantity: parseInt(item.productQuantity, 10),
      currency: item.payment.currency,
      symbol: item.payment.symbol,
      total: parseFloat(item.payment.total),
    }).execute();
  }

  // 3. Insert shipping fees
  for (const fee of cartData.shippingFees.supplierShippingFees) {
    const normId = normalizeSupplierId(fee.supplierId);
    db.insert(shippingFees).values({
      supplierId: normId,
      currency: fee.payment.currency,
      symbol: fee.payment.symbol,
      total: parseFloat(fee.payment.total),
    }).execute();
  }
}
