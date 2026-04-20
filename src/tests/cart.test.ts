import { describe, it, expect, beforeEach } from 'bun:test';
import { Elysia } from 'elysia';
import { cartRoute } from '../routes/cart';
import { seedDatabase } from '../db/seed';
import { db, initDb } from '../db/db';
import { cartItems, shippingFees, products, suppliers } from '../db/schema';

function resetDb() {
  initDb();
  db.delete(cartItems).run();
  db.delete(shippingFees).run();
  db.delete(products).run();
  db.delete(suppliers).run();
  seedDatabase();
}

const app = new Elysia().use(cartRoute);

describe('Cart Route', () => {
  beforeEach(() => {
    resetDb();
  });

  describe('GET /api/cart', () => {
    it('returns success with supplier groups', async () => {
      const res = await app.handle(new Request('http://localhost/api/cart'));
      expect(res.status).toBe(200);
      const body = await res.json() as { success: boolean; data: { suppliers: unknown[] } };
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.suppliers)).toBe(true);
      expect(body.data.suppliers.length).toBe(4);
    });

    it('returns a positive grand total', async () => {
      const res = await app.handle(new Request('http://localhost/api/cart'));
      const body = await res.json() as { data: { grandTotal: number } };
      expect(typeof body.data.grandTotal).toBe('number');
      expect(body.data.grandTotal).toBeGreaterThan(0);
    });

    it('returns a positive shipping total', async () => {
      const res = await app.handle(new Request('http://localhost/api/cart'));
      const body = await res.json() as { data: { shippingTotal: number } };
      expect(typeof body.data.shippingTotal).toBe('number');
      expect(body.data.shippingTotal).toBeGreaterThan(0);
    });

    it('groups products under each supplier', async () => {
      const res = await app.handle(new Request('http://localhost/api/cart'));
      const body = await res.json() as {
        data: { suppliers: { supplierId: string; supplierName: string; products: unknown[] }[] };
      };
      for (const group of body.data.suppliers) {
        expect(group.supplierId).toBeTruthy();
        expect(group.supplierName).toBeTruthy();
        expect(Array.isArray(group.products)).toBe(true);
        expect(group.products.length).toBeGreaterThan(0);
      }
    });

    it('returns empty suppliers and zero grand total when cart is empty', async () => {
      db.delete(cartItems).run();
      const res = await app.handle(new Request('http://localhost/api/cart'));
      const body = await res.json() as {
        success: boolean;
        data: { suppliers: unknown[]; grandTotal: number };
      };
      expect(body.success).toBe(true);
      expect(body.data.suppliers).toEqual([]);
      expect(body.data.grandTotal).toBe(0);
    });
  });

  describe('POST /api/cart/random', () => {
    it('returns success', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/cart/random', { method: 'POST' }),
      );
      expect(res.status).toBe(200);
      const body = await res.json() as { success: boolean };
      expect(body.success).toBe(true);
    });

    it('replaces cart with at least 2 items', async () => {
      await app.handle(
        new Request('http://localhost/api/cart/random', { method: 'POST' }),
      );
      const items = db.select().from(cartItems).all();
      expect(items.length).toBeGreaterThanOrEqual(2);
    });

    it('new cart items reference valid supplier IDs', async () => {
      await app.handle(
        new Request('http://localhost/api/cart/random', { method: 'POST' }),
      );
      const items = db.select().from(cartItems).all();
      const allSuppliers = db.select().from(suppliers).all();
      const supplierIds = new Set(allSuppliers.map(s => s.id));
      for (const item of items) {
        expect(supplierIds.has(item.supplierId)).toBe(true);
      }
    });
  });
});
