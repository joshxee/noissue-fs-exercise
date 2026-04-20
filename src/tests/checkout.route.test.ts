import { describe, it, expect, beforeEach } from 'bun:test';
import { Elysia } from 'elysia';
import { checkoutRoute } from '../routes/checkout';
import { seedDatabase } from '../db/seed';
import { db, initDb } from '../db/db';
import { cartItems, shippingFees, products, suppliers, purchaseOrders, purchaseOrderItems } from '../db/schema';

function resetDb() {
  initDb();
  db.delete(purchaseOrderItems).run();
  db.delete(purchaseOrders).run();
  db.delete(cartItems).run();
  db.delete(shippingFees).run();
  db.delete(products).run();
  db.delete(suppliers).run();
  seedDatabase();
}

const app = new Elysia().use(checkoutRoute);

describe('Checkout Route', () => {
  beforeEach(() => {
    resetDb();
  });

  describe('POST /api/checkout — success', () => {
    it('returns 200 with purchase orders', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/checkout', { method: 'POST' }),
      );
      expect(res.status).toBe(200);
      const body = await res.json() as { success: boolean; data: { purchaseOrders: unknown[] } };
      expect(body.success).toBe(true);
      expect(Array.isArray(body.data.purchaseOrders)).toBe(true);
      expect(body.data.purchaseOrders.length).toBe(4);
    });

    it('purchase orders contain required fields', async () => {
      const res = await app.handle(
        new Request('http://localhost/api/checkout', { method: 'POST' }),
      );
      const body = await res.json() as {
        data: {
          purchaseOrders: {
            poId: number;
            supplierId: string;
            supplierName: string;
            items: unknown[];
            itemTotal: number;
            shippingFee: number;
            orderTotal: number;
            currency: string;
            symbol: string;
          }[];
        };
      };
      for (const po of body.data.purchaseOrders) {
        expect(typeof po.poId).toBe('number');
        expect(po.supplierId).toBeTruthy();
        expect(po.supplierName).toBeTruthy();
        expect(Array.isArray(po.items)).toBe(true);
        expect(typeof po.itemTotal).toBe('number');
        expect(typeof po.shippingFee).toBe('number');
        expect(typeof po.orderTotal).toBe('number');
        expect(po.currency).toBeTruthy();
        expect(po.symbol).toBeTruthy();
      }
    });
  });

  describe('POST /api/checkout — empty cart', () => {
    it('returns 409 when cart is empty', async () => {
      db.delete(cartItems).run();
      const res = await app.handle(
        new Request('http://localhost/api/checkout', { method: 'POST' }),
      );
      expect(res.status).toBe(409);
      const body = await res.json() as { success: boolean; error: { code: string; message: string } };
      expect(body.success).toBe(false);
      expect(typeof body.error.message).toBe('string');
      expect(typeof body.error.code).toBe('string');
    });

    it('returns 409 on duplicate checkout (idempotency)', async () => {
      await app.handle(new Request('http://localhost/api/checkout', { method: 'POST' }));
      const res = await app.handle(
        new Request('http://localhost/api/checkout', { method: 'POST' }),
      );
      expect(res.status).toBe(409);
    });
  });
});
