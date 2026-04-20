import React from 'react';
import type { CartState } from './useCart';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-outline-variant/20 ' +
  'focus:border-primary focus:ring-0 text-on-surface px-0 py-3 ' +
  'peer transition-colors placeholder-transparent';

const LABEL_CLASS =
  'absolute left-0 -top-4 text-xs text-outline font-label pointer-events-none ' +
  'peer-placeholder-shown:top-3 peer-placeholder-shown:text-base ' +
  'peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary ' +
  'transition-all duration-200';

type Props = {
  cartState: CartState;
  shippingSelected: boolean;
  subtotal: number | null;
  shippingCost: number | null;
  total: number | null;
  symbol: string;
  currency: string;
};

export default function OrderSummary({ cartState, shippingSelected, subtotal, shippingCost, total, symbol, currency }: Props) {
  return (
    <div className="lg:col-span-5 relative">
      <div className="sticky top-28 bg-surface-container-low p-8 rounded-xl flex flex-col gap-8 shadow-[0_12px_40px_-15px_rgba(27,28,28,0.05)]">
        <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">Order Archive</h3>

        <div className="space-y-6">
          {cartState.status === 'idle' || cartState.status === 'loading' ? (
            [1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-start animate-pulse">
                <div className="w-20 h-20 flex-shrink-0 bg-surface-container rounded-lg" />
                <div className="flex-grow space-y-2 py-2">
                  <div className="h-4 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-1/2" />
                  <div className="h-3 bg-surface-container rounded w-1/4 mt-2" />
                </div>
              </div>
            ))
          ) : cartState.status === 'error' ? (
            <div className="bg-surface p-6 rounded-lg text-on-surface-variant font-body text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-outline">error</span>
              {cartState.message}
            </div>
          ) : cartState.data.suppliers.length === 0 ? (
            <div className="bg-surface p-6 rounded-lg text-on-surface-variant font-body text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-outline">shopping_cart</span>
              Your cart is empty.
            </div>
          ) : (
            cartState.data.suppliers.flatMap(supplier =>
              supplier.products.map(product => (
                <div key={product.sku} className="flex gap-4 items-start">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden flex items-center justify-center text-outline">
                    <span className="material-symbols-outlined text-2xl">
                      {product.type === 'Custom' ? 'brush' : 'inventory_2'}
                    </span>
                    <span className="absolute -top-2 -right-2 bg-outline-variant text-on-surface text-xs font-label w-5 h-5 flex items-center justify-center rounded-full">
                      {product.quantity >= 1000
                        ? `${Math.floor(product.quantity / 1000)}k`
                        : product.quantity}
                    </span>
                  </div>
                  <div className="flex-grow flex flex-col justify-between h-20 py-1">
                    <div>
                      <h4 className="font-body font-medium text-on-surface line-clamp-2">{product.name}</h4>
                      <p className="font-label text-xs text-on-surface-variant mt-1 line-clamp-1">{product.description}</p>
                    </div>
                    <div className="font-label text-sm text-on-surface font-medium">
                      {product.symbol}{product.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-grow pt-4">
            <input
              className={INPUT_CLASS}
              id="discount"
              placeholder="Discount code"
              type="text"
            />
            <label className={LABEL_CLASS} htmlFor="discount">Discount code</label>
          </div>
          <button
            type="button"
            className="bg-surface-container-high text-on-surface font-headline font-semibold px-6 py-2 rounded-lg hover:bg-surface-dim transition-colors self-end h-[42px]"
          >
            Apply
          </button>
        </div>

        <div className="space-y-3 pt-6 border-t border-outline-variant/10">
          <div className="flex justify-between items-center font-body text-sm text-on-surface-variant">
            <span>Subtotal</span>
            <span className="font-label text-on-surface">
              {subtotal !== null ? `${symbol}${subtotal.toFixed(2)}` : '—'}
            </span>
          </div>
          {shippingSelected && (
            <div className="flex justify-between items-center font-body text-sm text-on-surface-variant">
              <span>Shipping</span>
              <span className="font-label text-on-surface">
                {shippingCost !== null ? `${symbol}${shippingCost.toFixed(2)}` : '—'}
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end pt-6 border-t border-outline-variant/10">
          <span className="font-headline font-bold text-lg text-on-surface">Total</span>
          <div className="flex items-baseline gap-2">
            <span className="font-label text-xs text-on-surface-variant">{currency}</span>
            <span className="font-headline font-black text-3xl tracking-tight text-primary">
              {total !== null ? `${symbol}${total.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
