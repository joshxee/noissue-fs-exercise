import React from 'react';
import { useCart } from './useCart';
import { useCheckoutForm } from './useCheckoutForm';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

export default function Checkout() {
  const cartState = useCart();
  const checkoutForm = useCheckoutForm();

  const subtotal = cartState.status === 'success' ? cartState.data.grandTotal : null;
  const shippingCost = cartState.status === 'success' ? cartState.data.shippingTotal : null;
  const total =
    subtotal !== null && shippingCost !== null
      ? subtotal + (checkoutForm.shippingSelected ? shippingCost : 0)
      : null;
  const symbol = cartState.status === 'success' ? cartState.data.symbol : '$';
  const currency = cartState.status === 'success' ? cartState.data.currency : 'NZD';

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      <header className="bg-[#fcf9f8]/80 dark:bg-[#1b1c1c]/80 backdrop-blur-xl w-full sticky top-0 z-50">
        <div className="grid grid-cols-3 items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <nav className="hidden md:flex gap-6">
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Shop</a>
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Sustainability</a>
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Customizer</a>
          </nav>
          <a
            className="font-['Manrope'] text-2xl font-black tracking-[-0.04em] text-[#02251f] dark:text-[#fcf9f8] justify-self-center"
            href="#"
          >
            noissue
          </a>
          <div className="flex gap-4 items-center justify-self-end">
            <button type="button" className="text-[#02251f] dark:text-[#fcf9f8] scale-95 active:opacity-80 transition-all duration-200">
              <span className="material-symbols-outlined" data-icon="shopping_bag">shopping_bag</span>
            </button>
            <button type="button" className="text-[#02251f] dark:text-[#fcf9f8] scale-95 active:opacity-80 transition-all duration-200">
              <span className="material-symbols-outlined" data-icon="person">person</span>
            </button>
          </div>
        </div>
        <div className="bg-[#e5e2e1] dark:bg-[#2d2e2e] h-[1px] w-full opacity-20"></div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
        <CheckoutForm
          {...checkoutForm}
          shippingCost={shippingCost}
          symbol={symbol}
          currency={currency}
        />
        <OrderSummary
          cartState={cartState}
          shippingSelected={checkoutForm.shippingSelected}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
          symbol={symbol}
          currency={currency}
        />
      </main>

      <footer className="bg-[#e5e2e1] dark:bg-[#121212] w-full mt-auto">
        <div className="w-full px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
          <p className="font-['Space_Grotesk'] text-[12px] uppercase tracking-widest text-[#02251f] dark:text-[#fcf9f8] opacity-60">
            © 2023 noissue. Low-impact packaging for a circular economy.
          </p>
          <nav className="flex flex-wrap justify-center gap-6">
            <a className="font-['Space_Grotesk'] text-[12px] uppercase tracking-widest text-[#02251f] dark:text-[#fcf9f8] opacity-60 hover:opacity-100 transition-opacity ease-in-out duration-300" href="#">Eco-Alliance</a>
            <a className="font-['Space_Grotesk'] text-[12px] uppercase tracking-widest text-[#02251f] dark:text-[#fcf9f8] opacity-60 hover:opacity-100 transition-opacity ease-in-out duration-300" href="#">Wholesale</a>
            <a className="font-['Space_Grotesk'] text-[12px] uppercase tracking-widest text-[#02251f] dark:text-[#fcf9f8] opacity-60 hover:opacity-100 transition-opacity ease-in-out duration-300" href="#">Material Archive</a>
            <a className="font-['Space_Grotesk'] text-[12px] uppercase tracking-widest text-[#02251f] dark:text-[#fcf9f8] opacity-60 hover:opacity-100 transition-opacity ease-in-out duration-300" href="#">Privacy</a>
          </nav>
          <div className="font-['Manrope'] font-extrabold text-[#02251f] dark:text-[#fcf9f8] text-xl">
            noissue
          </div>
        </div>
      </footer>
    </div>
  );
}
