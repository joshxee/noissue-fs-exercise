import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import type { ConfirmationState, PurchaseOrder } from '../types/api';

export default function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;

  if (!state || !state.purchaseOrders || state.purchaseOrders.length === 0) {
    return <Navigate to="/" replace />;
  }

  const { purchaseOrders, shippingAddress } = state;

  const orderRef = `#NI-${purchaseOrders[0].poId.toString().padStart(4, '0')}-ECO`;
  const itemsTotal = purchaseOrders.reduce((sum, po) => sum + po.itemTotal, 0);
  const shippingTotal = purchaseOrders.reduce((sum, po) => sum + po.shippingFee, 0);
  const orderTotal = purchaseOrders.reduce((sum, po) => sum + po.orderTotal, 0);
  const { currency, symbol } = purchaseOrders[0];

  const hasAddress = shippingAddress.firstName || shippingAddress.address;

  return (
    <div className="bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <header className="w-full flex justify-center py-8 bg-background z-50">
        <Link className="font-headline text-3xl font-black tracking-[-0.04em] text-primary" to="/">noissue</Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-container text-on-secondary-container mb-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-primary mb-4">Order Confirmed.</h1>
            <p className="font-body text-lg text-on-surface-variant max-w-xl mx-auto">Your eco-friendly packaging is being prepped for the journey. Thank you for moving toward a circular economy.</p>
            <div className="mt-6 flex flex-col items-center">
              <span className="font-label text-sm text-outline uppercase tracking-widest">Order Reference</span>
              <span className="font-label text-lg font-semibold text-primary mt-1">{orderRef}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-8 bg-surface-container-low rounded-none md:rounded-xl p-6 md:p-10 relative overflow-hidden">
              <h2 className="font-headline text-2xl font-bold text-primary mb-8 tracking-tight">The Archive</h2>

              {purchaseOrders.map((po: PurchaseOrder, poIdx: number) => (
                <div key={po.poId} className={poIdx < purchaseOrders.length - 1 ? 'mb-10' : ''}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-sm text-outline">store</span>
                    <span className="font-label text-xs uppercase tracking-widest text-outline">{po.supplierName}</span>
                  </div>
                  <div className="space-y-8">
                    {po.items.map((item, itemIdx) => (
                      <div
                        key={`${po.poId}-${item.productSku}`}
                        className={`flex flex-col sm:flex-row gap-6 ${itemIdx < po.items.length - 1 ? 'pb-8 border-b border-outline-variant/10' : ''}`}
                      >
                        <div className="w-full sm:w-32 h-32 bg-surface-container-highest rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-4xl">
                            {item.productType === 'Custom' ? 'brush' : 'inventory_2'}
                          </span>
                        </div>
                        <div className="flex-grow flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-headline text-lg font-bold text-on-surface">{item.productName}</h3>
                            <span className="font-label text-md font-semibold text-primary ml-4">{symbol}{item.total.toFixed(2)}</span>
                          </div>
                          <p className="font-body text-sm text-on-surface-variant mb-3">
                            Qty: {item.quantity.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-4 flex flex-col gap-8">
              <div className="bg-surface-container-lowest rounded-xl p-8 relative z-10">
                <h3 className="font-headline text-xl font-bold text-primary mb-6">Summary</h3>
                <div className="space-y-4 font-body text-sm mb-6 pb-6 border-b border-outline-variant/10">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{symbol}{itemsTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span>{symbol}{shippingTotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-8">
                  <span className="font-headline font-bold text-on-surface">Total</span>
                  <span className="font-label text-xl font-bold text-primary">{currency} {symbol}{orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {hasAddress && (
                <div className="bg-surface-container-low rounded-xl p-8">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="material-symbols-outlined">local_shipping</span>
                    <h4 className="font-headline font-bold">Shipping To</h4>
                  </div>
                  <address className="font-body text-sm text-on-surface-variant not-italic leading-relaxed">
                    {shippingAddress.firstName} {shippingAddress.lastName}<br />
                    {shippingAddress.address}
                    {shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}<br />
                    {shippingAddress.city}{shippingAddress.state ? `, ${shippingAddress.state}` : ''} {shippingAddress.zip}<br />
                    {shippingAddress.country}
                  </address>
                </div>
              )}
            </div>
          </div>

          <div className="bg-primary text-on-primary rounded-xl p-8 md:p-12 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at top right, #1a3b34, transparent 70%)" }}></div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-label text-sm uppercase tracking-widest text-primary-fixed block mb-4">The Impact</span>
                <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Planting Trees. Packaging Better.</h2>
                <p className="font-body text-on-primary-fixed-variant text-lg max-w-md">By choosing our compostable and recycled materials, you've contributed to a lower footprint. We're planting a tree with the Eco-Alliance for this order.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-end items-start md:items-center">
                <div className="bg-primary-container rounded-lg p-6 flex-1 max-w-[200px]">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-3">nature</span>
                  <span className="block font-headline font-bold text-xl mb-1">+1 Tree</span>
                  <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Planted</span>
                </div>
                <div className="bg-primary-container rounded-lg p-6 flex-1 max-w-[200px]">
                  <span className="material-symbols-outlined text-4xl text-primary-fixed mb-3">recycling</span>
                  <span className="block font-headline font-bold text-xl mb-1">100%</span>
                  <span className="font-label text-xs uppercase tracking-widest text-on-primary-container">Circular</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link className="inline-flex items-center gap-2 font-headline font-semibold text-primary hover:text-surface-tint transition-colors group" to="/">
              <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Return to Store
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
