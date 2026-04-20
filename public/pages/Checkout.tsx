import React from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  CartResponse,
  CartErrorResponse,
  CartData,
  CheckoutResponse,
  CheckoutErrorResponse,
  ShippingAddress,
  ConfirmationState,
} from '../types/api';

type FormState = {
  email: string;
  newsletter: boolean;
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  paymentMethod: string;
};

type CartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: CartData }
  | { status: 'error'; message: string };

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

const INITIAL_FORM: FormState = {
  email: '',
  newsletter: false,
  country: 'US',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  paymentMethod: 'credit_card',
};

export default function Checkout() {
  const navigate = useNavigate();
  const [cartState, setCartState] = React.useState<CartState>({ status: 'idle' });
  const [submitState, setSubmitState] = React.useState<SubmitState>({ status: 'idle' });
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);

  React.useEffect(() => {
    setCartState({ status: 'loading' });
    fetch('/api/cart')
      .then(res => res.json())
      .then((json: CartResponse | CartErrorResponse) => {
        if (json.success) {
          setCartState({ status: 'success', data: json.data });
        } else {
          setCartState({ status: 'error', message: json.error });
        }
      })
      .catch(() => setCartState({ status: 'error', message: 'Unable to load cart' }));
  }, []);

  const handleField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleCheckbox = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.checked }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ status: 'loading' });

    fetch('/api/checkout', { method: 'POST' })
      .then(res => res.json())
      .then((json: CheckoutResponse | CheckoutErrorResponse) => {
        if (json.success) {
          const shippingAddress: ShippingAddress = {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          };
          const state: ConfirmationState = {
            purchaseOrders: json.data.purchaseOrders,
            shippingAddress,
          };
          navigate('/confirmation', { state });
        } else {
          setSubmitState({ status: 'error', message: json.error });
        }
      })
      .catch(() =>
        setSubmitState({ status: 'error', message: 'Checkout failed. Please try again.' })
      );
  };

  const subtotal = cartState.status === 'success' ? cartState.data.grandTotal : null;
  const shippingTotal = cartState.status === 'success' ? cartState.data.shippingTotal : null;
  const total = subtotal !== null && shippingTotal !== null ? subtotal + shippingTotal : null;
  const symbol = cartState.status === 'success' ? cartState.data.symbol : '$';
  const currency = cartState.status === 'success' ? cartState.data.currency : 'NZD';

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      <header className="bg-[#fcf9f8]/80 dark:bg-[#1b1c1c]/80 backdrop-blur-xl w-full sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <nav className="hidden md:flex gap-6">
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Shop</a>
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Sustainability</a>
            <a className="font-['Manrope'] tracking-tighter font-bold uppercase text-sm text-[#717976] dark:text-[#a0a8a5] hover:text-[#02251f] dark:hover:text-[#ffffff] transition-colors duration-300" href="#">Customizer</a>
          </nav>
          <a className="font-['Manrope'] text-2xl font-black tracking-[-0.04em] text-[#02251f] dark:text-[#fcf9f8] mx-auto md:mx-0" href="#">
            noissue
          </a>
          <div className="flex gap-4 items-center">
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
        <form className="lg:col-span-7 space-y-16" onSubmit={handleSubmit}>
          <section className="bg-surface-container-low p-8 rounded-xl transition-all duration-300">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="relative">
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleField('email')}
                />
                <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="email">Email Address</label>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <input
                  className="rounded-DEFAULT border-outline-variant/50 text-primary focus:ring-primary bg-transparent w-4 h-4"
                  id="newsletter"
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={handleCheckbox('newsletter')}
                />
                <label className="font-body text-sm text-on-surface-variant" htmlFor="newsletter">Email me with news and eco-packaging offers</label>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-xl transition-all duration-300">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-8">Delivery</h2>
            <div className="space-y-6">
              <div className="relative">
                <select
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 appearance-none font-body"
                  id="country"
                  value={form.country}
                  onChange={handleField('country')}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-3 text-outline pointer-events-none" data-icon="expand_more">expand_more</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                    id="firstName"
                    placeholder="First Name"
                    type="text"
                    value={form.firstName}
                    onChange={handleField('firstName')}
                  />
                  <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="firstName">First Name</label>
                </div>
                <div className="relative">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                    id="lastName"
                    placeholder="Last Name"
                    type="text"
                    value={form.lastName}
                    onChange={handleField('lastName')}
                  />
                  <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="lastName">Last Name</label>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                  id="address"
                  placeholder="Address"
                  type="text"
                  value={form.address}
                  onChange={handleField('address')}
                />
                <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="address">Address</label>
              </div>
              <div className="relative">
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                  id="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  type="text"
                  value={form.apartment}
                  onChange={handleField('apartment')}
                />
                <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="apartment">Apartment, suite, etc. (optional)</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative md:col-span-1">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                    id="city"
                    placeholder="City"
                    type="text"
                    value={form.city}
                    onChange={handleField('city')}
                  />
                  <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="city">City</label>
                </div>
                <div className="relative md:col-span-1">
                  <select
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 appearance-none font-body text-outline"
                    id="state"
                    value={form.state}
                    onChange={handleField('state')}
                  >
                    <option disabled value="">State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-3 text-outline pointer-events-none" data-icon="expand_more">expand_more</span>
                </div>
                <div className="relative md:col-span-1">
                  <input
                    className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                    id="zip"
                    placeholder="ZIP code"
                    type="text"
                    value={form.zip}
                    onChange={handleField('zip')}
                  />
                  <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="zip">ZIP code</label>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-xl transition-all duration-300">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-6">Shipping method</h2>
            <div className="bg-surface p-6 rounded-lg text-on-surface-variant font-body text-sm flex items-center gap-3">
              <span className="material-symbols-outlined text-outline" data-icon="info">info</span>
              Enter your shipping address to view available shipping methods.
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-xl transition-all duration-300">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">Payment</h2>
            <p className="font-body text-sm text-on-surface-variant mb-6">All transactions are secure and encrypted.</p>
            <div className="space-y-4">
              <label className="flex items-center gap-4 p-4 border border-outline-variant/20 rounded-lg cursor-pointer bg-surface transition-colors hover:bg-surface-container-highest">
                <input
                  className="text-primary focus:ring-primary w-5 h-5 bg-transparent border-outline"
                  name="payment"
                  type="radio"
                  value="credit_card"
                  checked={form.paymentMethod === 'credit_card'}
                  onChange={handleField('paymentMethod')}
                />
                <div className="flex-grow font-body text-on-surface font-medium">Credit card</div>
                <div className="flex gap-2 text-outline">
                  <span className="material-symbols-outlined" data-icon="credit_card">credit_card</span>
                </div>
              </label>
              <label className="flex items-center gap-4 p-4 border border-outline-variant/20 rounded-lg cursor-pointer bg-surface transition-colors hover:bg-surface-container-highest">
                <input
                  className="text-primary focus:ring-primary w-5 h-5 bg-transparent border-outline"
                  name="payment"
                  type="radio"
                  value="paypal"
                  checked={form.paymentMethod === 'paypal'}
                  onChange={handleField('paymentMethod')}
                />
                <div className="flex-grow font-body text-on-surface font-medium">PayPal</div>
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8">
            <button type="button" className="font-headline font-semibold text-tertiary flex items-center gap-2 hover:text-tertiary-container transition-colors">
              <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
              Return to cart
            </button>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <button
                type="submit"
                disabled={submitState.status === 'loading'}
                className="w-full md:w-auto bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold py-4 px-10 rounded-xl hover:opacity-90 transition-opacity text-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitState.status === 'loading' ? 'Processing...' : 'Pay now'}
              </button>
              {submitState.status === 'error' && (
                <p className="text-sm text-red-600 font-body">{submitState.message}</p>
              )}
            </div>
          </div>
        </form>

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
              <div className="relative flex-grow">
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 peer transition-colors placeholder-transparent"
                  id="discount"
                  placeholder="Discount code"
                  type="text"
                />
                <label className="absolute left-0 top-3 text-outline text-sm font-label peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base" htmlFor="discount">Discount code</label>
              </div>
              <button type="button" className="bg-surface-container-high text-on-surface font-headline font-semibold px-6 py-2 rounded-lg hover:bg-surface-dim transition-colors self-end h-[42px]">Apply</button>
            </div>

            <div className="space-y-3 pt-6 border-t border-outline-variant/10">
              <div className="flex justify-between items-center font-body text-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-label text-on-surface">
                  {subtotal !== null ? `${symbol}${subtotal.toFixed(2)}` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center font-body text-sm text-on-surface-variant">
                <span>Shipping</span>
                <span className="font-label text-on-surface">
                  {shippingTotal !== null ? `${symbol}${shippingTotal.toFixed(2)}` : 'Calculated at next step'}
                </span>
              </div>
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
