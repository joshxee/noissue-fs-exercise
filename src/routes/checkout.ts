import { Elysia } from 'elysia';
import { processCheckout } from '../services/checkout';

export const checkoutRoute = new Elysia({ prefix: '/api' })
  .post('/checkout', async () => {
    try {
      const purchaseOrders = await processCheckout();
      return {
        success: true,
        data: {
          purchaseOrders
        }
      };
    } catch (error) {
      console.error('Checkout error:', error);
      return {
        success: false,
        error: 'Failed to process checkout'
      };
    }
  });
