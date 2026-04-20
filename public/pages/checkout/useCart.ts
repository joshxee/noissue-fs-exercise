import React from 'react';
import type { CartData, CartErrorResponse, CartResponse } from '../../types/api';

export type CartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: CartData }
  | { status: 'error'; message: string };

export function useCart(): CartState {
  const [cartState, setCartState] = React.useState<CartState>({ status: 'idle' });

  React.useEffect(() => {
    setCartState({ status: 'loading' });
    fetch('/api/cart')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: CartResponse | CartErrorResponse) => {
        if (json.success) setCartState({ status: 'success', data: json.data });
        else setCartState({ status: 'error', message: json.error.message });
      })
      .catch(() => setCartState({ status: 'error', message: 'Unable to load cart' }));
  }, []);

  return cartState;
}
