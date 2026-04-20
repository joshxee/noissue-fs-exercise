import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessionOrders } from '../lib/sessionOrders';
import type { SessionOrder } from '../lib/sessionOrders';

type GenerateState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order, index }: { order: SessionOrder; index: number }) {
  const grandTotal = order.purchaseOrders.reduce((sum, po) => sum + po.orderTotal, 0);
  const { symbol, currency } = order.purchaseOrders[0];
  const orderRef = `#NI-${order.purchaseOrders[0].poId.toString().padStart(4, '0')}-ECO`;

  return (
    <div className="bg-surface-container-low rounded-xl p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-outline-variant/10">
        <div>
          <span className="font-label text-xs uppercase tracking-widest text-outline block mb-1">
            Order {index + 1} · {formatDate(order.placedAt)}
          </span>
          <span className="font-label text-base font-semibold text-primary">{orderRef}</span>
        </div>
        <div className="text-right">
          <span className="font-label text-xs uppercase tracking-widest text-outline block mb-1">{currency} Total</span>
          <span className="font-headline text-xl font-bold text-on-surface">{symbol}{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-6">
        {order.purchaseOrders.map(po => (
          <div key={po.poId}>
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm text-outline">store</span>
              <span className="font-label text-xs uppercase tracking-widest text-outline">{po.supplierName}</span>
            </div>
            <div className="space-y-2 pl-5">
              {po.items.map(item => (
                <div key={`${po.poId}-${item.productSku}`} className="flex justify-between items-center font-body text-sm">
                  <span className="text-on-surface-variant">
                    {item.productName}
                    <span className="text-outline ml-2">×{item.quantity.toLocaleString()}</span>
                  </span>
                  <span className="text-on-surface font-medium ml-4">{symbol}{item.total.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center font-body text-xs text-outline pt-2 border-t border-outline-variant/10">
                <span>Shipping</span>
                <span>{symbol}{po.shippingFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(order.shippingAddress.firstName || order.shippingAddress.city) && (
        <div className="mt-6 pt-6 border-t border-outline-variant/10 flex items-start gap-2 text-sm font-body text-on-surface-variant">
          <span className="material-symbols-outlined text-base text-outline mt-0.5">local_shipping</span>
          <span>
            {[order.shippingAddress.firstName, order.shippingAddress.lastName].filter(Boolean).join(' ')}
            {order.shippingAddress.city ? ` · ${order.shippingAddress.city}` : ''}
            {order.shippingAddress.country ? `, ${order.shippingAddress.country}` : ''}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Store() {
  const navigate = useNavigate();
  const orders = getSessionOrders();
  const [generateState, setGenerateState] = React.useState<GenerateState>({ status: 'idle' });

  const handleGenerateCart = () => {
    setGenerateState({ status: 'loading' });
    fetch('/api/cart/random', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { success: boolean; error?: string }) => {
        if (json.success) {
          navigate('/');
        } else {
          setGenerateState({ status: 'error', message: json.error ?? 'Failed to generate cart' });
        }
      })
      .catch(() =>
        setGenerateState({ status: 'error', message: 'Could not generate a new cart. Please try again.' })
      );
  };

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      <header className="w-full flex justify-center py-8 bg-background z-50">
        <Link className="font-headline text-3xl font-black tracking-[-0.04em] text-primary" to="/">noissue</Link>
      </header>

      <main className="flex-grow flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl w-full">

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-primary mb-4">
              Checkout Exercise Complete.
            </h1>
            <p className="font-body text-lg text-on-surface-variant max-w-lg mx-auto">
              {orders.length === 0
                ? 'No orders placed yet in this session.'
                : `${orders.length} order${orders.length === 1 ? '' : 's'} placed this session.`}
            </p>
          </div>

          {orders.length > 0 && (
            <section className="mb-16">
              <h2 className="font-headline text-2xl font-bold text-primary mb-6 tracking-tight">Session Orders</h2>
              <div className="space-y-6">
                {orders.map((order, i) => (
                  <OrderCard key={order.id} order={order} index={i} />
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              onClick={handleGenerateCart}
              disabled={generateState.status === 'loading'}
              className={`font-headline font-bold py-4 px-10 rounded-xl transition-all ${
                generateState.status === 'loading'
                  ? 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 cursor-pointer'
              }`}
            >
              {generateState.status === 'loading' ? 'Generating…' : 'Generate New Cart'}
            </button>
            {generateState.status === 'error' && (
              <p className="font-body text-sm text-red-500">{generateState.message}</p>
            )}
            <p className="font-body text-xs text-outline max-w-xs">
              Picks a random selection from the product catalogue and starts a new checkout run.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
