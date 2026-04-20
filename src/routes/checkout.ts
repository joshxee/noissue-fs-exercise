import { Elysia } from 'elysia';
import { processCheckout } from '../services/checkout';

export const checkoutRoute = new Elysia({ prefix: '/api' })
  .post('/checkout', ({ set }) => {
    try {
      const purchaseOrders = processCheckout();
      if (purchaseOrders === null) {
        set.status = 409;
        return { success: false, error: 'Cart is empty or has already been checked out' };
      }
      return { success: true, data: { purchaseOrders } };
    } catch {
      set.status = 500;
      return { success: false, error: 'Failed to process checkout' };
    }
  });
