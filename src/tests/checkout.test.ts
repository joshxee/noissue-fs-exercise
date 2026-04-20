import { describe, it, expect, beforeAll } from 'bun:test';
import { processCheckout } from '../services/checkout';
import { seedDatabase } from '../db/seed';

describe('Checkout Service', () => {
  beforeAll(() => {
    // Seed the database with the cart.json fixture data before tests run
    seedDatabase();
  });

  it('should generate purchase orders for each supplier', async () => {
    const purchaseOrders = await processCheckout();
    
    // Check that we generated 4 purchase orders based on the seeded data
    expect(purchaseOrders.length).toBe(4);

    // Find the purchase order for supplier 1 (ACME Printing Co.)
    const supplier1Po = purchaseOrders.find(po => po.supplierId === '1');
    expect(supplier1Po).toBeDefined();
    
    // Items total for supplier 1: 300 + 540 = 840
    expect(supplier1Po!.itemTotal).toBe(840);
    // Shipping fee for supplier 1: 20
    expect(supplier1Po!.shippingFee).toBe(20);
    // Order total for supplier 1: 840 + 20 = 860
    expect(supplier1Po!.orderTotal).toBe(860);

    // Verify it contains the right number of items
    expect(supplier1Po!.items.length).toBe(2);

    // Verify supplier 2
    const supplier2Po = purchaseOrders.find(po => po.supplierId === '2');
    expect(supplier2Po).toBeDefined();
    expect(supplier2Po!.orderTotal).toBe(54); // 44 item + 10 shipping
  });
});
