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
import { appendSessionOrder } from '../lib/sessionOrders';

const SHIPPING_COST = 50;

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
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;
type TouchedFields = Partial<Record<keyof FormState, boolean>>;

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
  country: 'NZ',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
};

function luhnCheck(num: string): boolean {
  const digits = num.split('').reverse().map(Number);
  const sum = digits.reduce((acc, d, i) => {
    if (i % 2 === 1) {
      const doubled = d * 2;
      return acc + (doubled > 9 ? doubled - 9 : doubled);
    }
    return acc + d;
  }, 0);
  return sum % 10 === 0;
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!form.address.trim()) errors.address = 'Address is required';
  if (!form.city.trim()) errors.city = 'City is required';
  if (!form.zip.trim()) errors.zip = 'Postcode is required';

  const rawCard = form.cardNumber.replace(/\s/g, '');
  if (!rawCard) {
    errors.cardNumber = 'Card number is required';
  } else if (rawCard.length !== 16 || !luhnCheck(rawCard)) {
    errors.cardNumber = 'Enter a valid card number';
  }

  if (!form.cardName.trim()) {
    errors.cardName = 'Cardholder name is required';
  }

  if (!form.cardExpiry) {
    errors.cardExpiry = 'Expiry date is required';
  } else {
    const parts = form.cardExpiry.split('/');
    if (parts.length === 2 && parts[0] && parts[1]) {
      const month = parseInt(parts[0], 10);
      const year = parseInt(parts[1], 10) + 2000;
      const now = new Date();
      const expDate = new Date(year, month - 1);
      if (month < 1 || month > 12 || expDate < new Date(now.getFullYear(), now.getMonth())) {
        errors.cardExpiry = 'Enter a valid expiry date';
      }
    } else {
      errors.cardExpiry = 'Enter a valid expiry date';
    }
  }

  if (!form.cardCvv) {
    errors.cardCvv = 'CVV is required';
  } else if (!/^\d{3,4}$/.test(form.cardCvv)) {
    errors.cardCvv = 'Enter a valid CVV';
  }

  return errors;
}

// Label floats above by default; peer-placeholder-shown pulls it down when input is empty
const LABEL_CLASS =
  'absolute left-0 -top-4 text-xs text-outline font-label pointer-events-none ' +
  'peer-placeholder-shown:top-3 peer-placeholder-shown:text-base ' +
  'peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary ' +
  'transition-all duration-200';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-outline-variant/20 ' +
  'focus:border-primary focus:ring-0 text-on-surface px-0 py-3 ' +
  'peer transition-colors placeholder-transparent';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartState, setCartState] = React.useState<CartState>({ status: 'idle' });
  const [submitState, setSubmitState] = React.useState<SubmitState>({ status: 'idle' });
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
  const [touched, setTouched] = React.useState<TouchedFields>({});
  const [shippingSelected, setShippingSelected] = React.useState(false);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  React.useEffect(() => {
    setCartState({ status: 'loading' });
    fetch('/api/cart')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: CartResponse | CartErrorResponse) => {
        if (json.success) setCartState({ status: 'success', data: json.data });
        else setCartState({ status: 'error', message: json.error });
      })
      .catch(() => setCartState({ status: 'error', message: 'Unable to load cart' }));
  }, []);

  const formErrors = React.useMemo(() => validateForm(form), [form]);
  const canSubmit = Object.keys(formErrors).length === 0 && shippingSelected;

  const addressComplete =
    form.address.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.zip.trim().length > 0 &&
    form.country.length > 0;

  const handleField = React.useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value })),
    []
  );

  const handleCheckbox = React.useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.checked })),
    []
  );

  const handleCardNumber = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setForm(prev => ({ ...prev, cardNumber: formatted }));
  }, []);

  const handleCardExpiry = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length > 2) raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    setForm(prev => ({ ...prev, cardExpiry: raw }));
  }, []);

  const handleBlur = React.useCallback(
    (field: keyof FormState) => () =>
      setTouched(prev => ({ ...prev, [field]: true })),
    []
  );

  const showError = (field: keyof FormState): string | undefined =>
    (touched[field] || submitAttempted) ? formErrors[field] : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!canSubmit) {
      const allTouched: TouchedFields = {};
      (Object.keys(INITIAL_FORM) as Array<keyof FormState>).forEach(k => {
        allTouched[k] = true;
      });
      setTouched(allTouched);
      return;
    }

    setSubmitState({ status: 'loading' });
    fetch('/api/checkout', { method: 'POST' })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
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
          const confirmState: ConfirmationState = {
            purchaseOrders: json.data.purchaseOrders,
            shippingAddress,
          };
          appendSessionOrder(json.data.purchaseOrders, shippingAddress);
          navigate('/confirmation', { state: confirmState });
        } else {
          setSubmitState({ status: 'error', message: json.error });
        }
      })
      .catch(() =>
        setSubmitState({ status: 'error', message: 'Checkout failed. Please try again.' })
      );
  };

  const subtotal = cartState.status === 'success' ? cartState.data.grandTotal : null;
  const total = subtotal !== null ? subtotal + (shippingSelected ? SHIPPING_COST : 0) : null;
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
        <form className="lg:col-span-7 space-y-16" onSubmit={handleSubmit}>

          {/* Contact Information */}
          <section className="bg-surface-container-low p-8 rounded-xl">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="relative pt-4">
                <input
                  className={INPUT_CLASS}
                  id="email"
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleField('email')}
                  onBlur={handleBlur('email')}
                />
                <label className={LABEL_CLASS} htmlFor="email">Email Address</label>
                {showError('email') && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{showError('email')}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  className="rounded-DEFAULT border-outline-variant/50 text-primary focus:ring-primary bg-transparent w-4 h-4"
                  id="newsletter"
                  type="checkbox"
                  checked={form.newsletter}
                  onChange={handleCheckbox('newsletter')}
                />
                <label className="font-body text-sm text-on-surface-variant" htmlFor="newsletter">
                  Email me with news and eco-packaging offers
                </label>
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="bg-surface-container-low p-8 rounded-xl">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-8">Delivery</h2>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs text-outline font-label mb-1" htmlFor="country">Country</label>
                <select
                  className="w-full bg-transparent border-0 border-b border-outline-variant/20 focus:border-primary focus:ring-0 text-on-surface px-0 py-3 appearance-none font-body"
                  id="country"
                  value={form.country}
                  onChange={handleField('country')}
                >
                  <option value="NZ">New Zealand</option>
                  <option value="AU">Australia</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 bottom-3 text-outline pointer-events-none" data-icon="expand_more">expand_more</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="firstName"
                    placeholder="First Name"
                    type="text"
                    value={form.firstName}
                    onChange={handleField('firstName')}
                    onBlur={handleBlur('firstName')}
                  />
                  <label className={LABEL_CLASS} htmlFor="firstName">First Name</label>
                </div>
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="lastName"
                    placeholder="Last Name"
                    type="text"
                    value={form.lastName}
                    onChange={handleField('lastName')}
                    onBlur={handleBlur('lastName')}
                  />
                  <label className={LABEL_CLASS} htmlFor="lastName">Last Name</label>
                </div>
              </div>

              <div className="relative pt-4">
                <input
                  className={INPUT_CLASS}
                  id="address"
                  placeholder="Address Line 1"
                  type="text"
                  value={form.address}
                  onChange={handleField('address')}
                  onBlur={handleBlur('address')}
                />
                <label className={LABEL_CLASS} htmlFor="address">Address Line 1</label>
                {showError('address') && (
                  <p role="alert" className="mt-1 text-xs text-red-500">{showError('address')}</p>
                )}
              </div>

              <div className="relative pt-4">
                <input
                  className={INPUT_CLASS}
                  id="apartment"
                  placeholder="Apartment, suite, etc. (optional)"
                  type="text"
                  value={form.apartment}
                  onChange={handleField('apartment')}
                />
                <label className={LABEL_CLASS} htmlFor="apartment">Apartment, suite, etc. (optional)</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="city"
                    placeholder="City"
                    type="text"
                    value={form.city}
                    onChange={handleField('city')}
                    onBlur={handleBlur('city')}
                  />
                  <label className={LABEL_CLASS} htmlFor="city">City</label>
                  {showError('city') && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{showError('city')}</p>
                  )}
                </div>
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="state"
                    placeholder="State / Region"
                    type="text"
                    value={form.state}
                    onChange={handleField('state')}
                  />
                  <label className={LABEL_CLASS} htmlFor="state">State / Region</label>
                </div>
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="zip"
                    placeholder="Postcode"
                    type="text"
                    value={form.zip}
                    onChange={handleField('zip')}
                    onBlur={handleBlur('zip')}
                  />
                  <label className={LABEL_CLASS} htmlFor="zip">Postcode</label>
                  {showError('zip') && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{showError('zip')}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Shipping method */}
          <section className="bg-surface-container-low p-8 rounded-xl">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-6">Shipping method</h2>
            {!addressComplete ? (
              <div className="bg-surface p-6 rounded-lg text-on-surface-variant font-body text-sm flex items-center gap-3">
                <span className="material-symbols-outlined text-outline" data-icon="info">info</span>
                Enter your shipping address to view available shipping methods.
              </div>
            ) : (
              <label
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  shippingSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 bg-surface hover:bg-surface-container-highest'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  className="text-primary focus:ring-primary w-5 h-5 bg-transparent border-outline"
                  checked={shippingSelected}
                  onChange={() => setShippingSelected(true)}
                />
                <div className="flex-grow">
                  <div className="font-body text-on-surface font-medium">Standard Shipping</div>
                  <div className="font-body text-xs text-on-surface-variant mt-0.5">Estimated 3–5 business days</div>
                </div>
                <div className="font-label font-semibold text-on-surface">NZD $50.00</div>
              </label>
            )}
          </section>

          {/* Payment */}
          <section className="bg-surface-container-low p-8 rounded-xl">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">Payment</h2>
            <p className="font-body text-sm text-on-surface-variant mb-6">All transactions are secure and encrypted.</p>

            <div className="border border-primary rounded-xl overflow-hidden">
              <div className="flex items-center gap-4 p-4 bg-primary/5">
                <input
                  className="text-primary focus:ring-primary w-5 h-5 bg-transparent border-outline"
                  name="payment"
                  type="radio"
                  checked
                  readOnly
                />
                <div className="flex-grow font-body text-on-surface font-medium">Credit card</div>
                <span className="material-symbols-outlined text-xl text-outline" data-icon="credit_card">credit_card</span>
              </div>

              <div className="p-6 border-t border-outline-variant/10 bg-surface space-y-6">
                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="cardNumber"
                    placeholder="Card number"
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    autoComplete="cc-number"
                    value={form.cardNumber}
                    onChange={handleCardNumber}
                    onBlur={handleBlur('cardNumber')}
                  />
                  <label className={LABEL_CLASS} htmlFor="cardNumber">Card number</label>
                  {showError('cardNumber') && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardNumber')}</p>
                  )}
                </div>

                <div className="relative pt-4">
                  <input
                    className={INPUT_CLASS}
                    id="cardName"
                    placeholder="Cardholder name"
                    type="text"
                    autoComplete="cc-name"
                    value={form.cardName}
                    onChange={handleField('cardName')}
                    onBlur={handleBlur('cardName')}
                  />
                  <label className={LABEL_CLASS} htmlFor="cardName">Cardholder name</label>
                  {showError('cardName') && (
                    <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardName')}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="relative pt-4">
                    <input
                      className={INPUT_CLASS}
                      id="cardExpiry"
                      placeholder="MM/YY"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      autoComplete="cc-exp"
                      value={form.cardExpiry}
                      onChange={handleCardExpiry}
                      onBlur={handleBlur('cardExpiry')}
                    />
                    <label className={LABEL_CLASS} htmlFor="cardExpiry">Expiry (MM/YY)</label>
                    {showError('cardExpiry') && (
                      <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardExpiry')}</p>
                    )}
                  </div>
                  <div className="relative pt-4">
                    <input
                      className={INPUT_CLASS}
                      id="cardCvv"
                      placeholder="CVV"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      autoComplete="cc-csc"
                      value={form.cardCvv}
                      onChange={handleField('cardCvv')}
                      onBlur={handleBlur('cardCvv')}
                    />
                    <label className={LABEL_CLASS} htmlFor="cardCvv">CVV</label>
                    {showError('cardCvv') && (
                      <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardCvv')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8">
            <button
              type="button"
              className="font-headline font-semibold text-tertiary flex items-center gap-2 hover:text-tertiary-container transition-colors"
            >
              <span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span>
              Return to cart
            </button>
            <div className="flex flex-col items-end gap-2 w-full md:w-auto">
              <button
                type="submit"
                disabled={submitState.status === 'loading'}
                className={`w-full md:w-auto font-headline font-bold py-4 px-10 rounded-xl transition-all text-center ${
                  canSubmit && submitState.status !== 'loading'
                    ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90 cursor-pointer'
                    : 'bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed'
                }`}
              >
                {submitState.status === 'loading' ? 'Processing…' : 'Pay now'}
              </button>
              {submitState.status === 'error' && (
                <p className="text-sm text-red-600 font-body">{submitState.message}</p>
              )}
              {submitAttempted && !canSubmit && (
                <p className="text-sm text-red-500 font-body">
                  {!shippingSelected && Object.keys(formErrors).length === 0
                    ? 'Please select a shipping method.'
                    : 'Please complete all required fields.'}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Order summary */}
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
                  <span className="font-label text-on-surface">{symbol}{SHIPPING_COST.toFixed(2)}</span>
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
