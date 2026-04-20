import { Elysia } from 'elysia';
import { db } from '../db/db';
import { cartItems, products, suppliers, shippingFees } from '../db/schema';
import { seedRandomCart } from '../services/cart';

type CartProductEntry = {
  sku: string;
  name: string;
  description: string;
  type: string;
  quantity: number;
  currency: string;
  symbol: string;
  total: number;
};

type SupplierGroup = {
  supplierId: string;
  supplierName: string;
  products: CartProductEntry[];
  subtotal: number;
  currency: string;
  symbol: string;
};

export const cartRoute = new Elysia({ prefix: '/api' })
  .get('/cart', ({ set }) => {
    try {
      const allCartItems = db.select().from(cartItems).all();
      const allProducts = db.select().from(products).all();
      const allSuppliers = db.select().from(suppliers).all();
      const allShippingFees = db.select().from(shippingFees).all();

      const productMap = new Map(allProducts.map(p => [p.sku, p]));
      const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

      const grouped = allCartItems.reduce<Map<string, SupplierGroup>>((acc, item) => {
        const product = productMap.get(item.productSku);
        const supplier = supplierMap.get(item.supplierId);
        if (!product || !supplier) return acc;

        const cartProduct: CartProductEntry = {
          sku: item.productSku,
          name: product.name,
          description: product.description ?? '',
          type: product.type,
          quantity: item.quantity,
          currency: item.currency,
          symbol: item.symbol,
          total: item.total,
        };

        const existing = acc.get(item.supplierId);
        if (existing) {
          return acc.set(item.supplierId, {
            ...existing,
            products: [...existing.products, cartProduct],
            subtotal: existing.subtotal + item.total,
          });
        }

        return acc.set(item.supplierId, {
          supplierId: item.supplierId,
          supplierName: supplier.name,
          products: [cartProduct],
          subtotal: item.total,
          currency: item.currency,
          symbol: item.symbol,
        });
      }, new Map());

      const supplierGroups = Array.from(grouped.values());
      const grandTotal = supplierGroups.reduce((sum, g) => sum + g.subtotal, 0);
      const shippingTotal = allShippingFees.reduce((sum, f) => sum + f.total, 0);
      const currency = supplierGroups[0]?.currency ?? 'NZD';
      const symbol = supplierGroups[0]?.symbol ?? '$';

      return {
        success: true,
        data: { suppliers: supplierGroups, grandTotal, shippingTotal, currency, symbol },
      };
    } catch {
      set.status = 500;
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } };
    }
  })
  .post('/cart/random', ({ set }) => {
    try {
      seedRandomCart();
      return { success: true };
    } catch {
      set.status = 500;
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } };
    }
  });
