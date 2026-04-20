import { describe, it, expect, beforeEach } from 'bun:test';
import { processCheckout } from '../services/checkout';
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

describe('Checkout Service', () => {
  beforeEach(() => {
    resetDb();
  });

  it('generates one purchase order per supplier', () => {
    const pos = processCheckout();
    expect(pos).not.toBeNull();
    expect(pos!.length).toBe(4);
  });

  it('calculates correct totals for supplier 1', () => {
    const pos = processCheckout();
    const s1 = pos!.find(po => po.supplierId === '1');
    expect(s1).toBeDefined();
    expect(s1!.itemTotal).toBe(840);
    expect(s1!.shippingFee).toBe(20);
    expect(s1!.orderTotal).toBe(860);
    expect(s1!.items.length).toBe(2);
  });

  it('calculates correct totals for supplier 2', () => {
    const pos = processCheckout();
    const s2 = pos!.find(po => po.supplierId === '2');
    expect(s2).toBeDefined();
    expect(s2!.orderTotal).toBe(54);
  });

  it('returns null when cart is empty', () => {
    db.delete(cartItems).run();
    expect(processCheckout()).toBeNull();
  });

  it('clears cart items after checkout', () => {
    processCheckout();
    expect(db.select().from(cartItems).all().length).toBe(0);
  });

  it('returns null on duplicate checkout (idempotency)', () => {
    processCheckout();
    expect(processCheckout()).toBeNull();
  });

  it('persists purchase orders to the database', () => {
    processCheckout();
    expect(db.select().from(purchaseOrders).all().length).toBe(4);
  });

  it('includes supplier name in purchase orders', () => {
    const pos = processCheckout();
    for (const po of pos!) {
      expect(typeof po.supplierName).toBe('string');
      expect(po.supplierName.length).toBeGreaterThan(0);
    }
  });

  it('includes enriched product name and type in items', () => {
    const pos = processCheckout();
    for (const po of pos!) {
      for (const item of po.items) {
        expect(item.productName).toBeTruthy();
        expect(item.productType).toBeTruthy();
      }
    }
  });

  it('order total equals item total plus shipping fee for each PO', () => {
    const pos = processCheckout();
    for (const po of pos!) {
      expect(po.orderTotal).toBe(po.itemTotal + po.shippingFee);
    }
  });
});
