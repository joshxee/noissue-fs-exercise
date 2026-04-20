import { Elysia } from 'elysia';
import { processCheckout } from '../services/checkout';

export const checkoutRoute = new Elysia({ prefix: '/api' })
  .post('/checkout', ({ set }) => {
    try {
      const purchaseOrders = processCheckout();
      if (purchaseOrders === null) {
        set.status = 409;
        return { success: false, error: { code: 'CART_EMPTY_OR_CHECKED_OUT', message: 'Cart is empty or has already been checked out' } };
      }
      console.log(JSON.stringify({
        event: 'checkout.complete',
        poCount: purchaseOrders.length,
        grandTotal: purchaseOrders.reduce((s, po) => s + po.orderTotal, 0),
        supplierIds: purchaseOrders.map(po => po.supplierId),
      }));
      return { success: true, data: { purchaseOrders } };
    } catch {
      set.status = 500;
      return { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } };
    }
  });
