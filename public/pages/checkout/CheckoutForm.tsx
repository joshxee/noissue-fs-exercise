import React from 'react';
import type { CheckoutFormResult, FormState } from './useCheckoutForm';

const LABEL_CLASS =
  'absolute left-0 -top-4 text-xs text-outline font-label pointer-events-none ' +
  'peer-placeholder-shown:top-3 peer-placeholder-shown:text-base ' +
  'peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary ' +
  'transition-all duration-200';

const INPUT_CLASS =
  'w-full bg-transparent border-0 border-b border-outline-variant/20 ' +
  'focus:border-primary focus:ring-0 text-on-surface px-0 py-3 ' +
  'peer transition-colors placeholder-transparent';

type Props = CheckoutFormResult & {
  shippingCost: number | null;
  symbol: string;
  currency: string;
};

export default function CheckoutForm({
  form, touched, submitState, submitAttempted, shippingSelected, setShippingSelected,
  formErrors, canSubmit, handleField, handleCheckbox, handleCardNumber, handleCardExpiry,
  handleBlur, handleSubmit, showError, shippingCost, symbol, currency,
}: Props) {
  return (
    <form className="lg:col-span-7 space-y-16" onSubmit={handleSubmit}>

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
              <input className={INPUT_CLASS} id="firstName" placeholder="First Name" type="text"
                value={form.firstName} onChange={handleField('firstName')} onBlur={handleBlur('firstName')} />
              <label className={LABEL_CLASS} htmlFor="firstName">First Name</label>
            </div>
            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="lastName" placeholder="Last Name" type="text"
                value={form.lastName} onChange={handleField('lastName')} onBlur={handleBlur('lastName')} />
              <label className={LABEL_CLASS} htmlFor="lastName">Last Name</label>
            </div>
          </div>

          <div className="relative pt-4">
            <input className={INPUT_CLASS} id="address" placeholder="Address Line 1" type="text"
              value={form.address} onChange={handleField('address')} onBlur={handleBlur('address')} />
            <label className={LABEL_CLASS} htmlFor="address">Address Line 1</label>
            {showError('address') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('address')}</p>}
          </div>

          <div className="relative pt-4">
            <input className={INPUT_CLASS} id="apartment" placeholder="Apartment, suite, etc. (optional)" type="text"
              value={form.apartment} onChange={handleField('apartment')} />
            <label className={LABEL_CLASS} htmlFor="apartment">Apartment, suite, etc. (optional)</label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="city" placeholder="City" type="text"
                value={form.city} onChange={handleField('city')} onBlur={handleBlur('city')} />
              <label className={LABEL_CLASS} htmlFor="city">City</label>
              {showError('city') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('city')}</p>}
            </div>
            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="state" placeholder="State / Region" type="text"
                value={form.state} onChange={handleField('state')} />
              <label className={LABEL_CLASS} htmlFor="state">State / Region</label>
            </div>
            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="zip" placeholder="Postcode" type="text"
                value={form.zip} onChange={handleField('zip')} onBlur={handleBlur('zip')} />
              <label className={LABEL_CLASS} htmlFor="zip">Postcode</label>
              {showError('zip') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('zip')}</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low p-8 rounded-xl">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-6">Shipping method</h2>
        <label className="flex items-center gap-4 p-4 border rounded-lg border-primary bg-primary/5">
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
          <div className="font-label font-semibold text-on-surface">
            {shippingCost !== null ? `${currency} ${symbol}${shippingCost.toFixed(2)}` : '—'}
          </div>
        </label>
      </section>

      <section className="bg-surface-container-low p-8 rounded-xl">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-2">Payment</h2>
        <p className="font-body text-sm text-on-surface-variant mb-6">All transactions are secure and encrypted.</p>

        <div className="border border-primary rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 p-4 bg-primary/5">
            <input className="text-primary focus:ring-primary w-5 h-5 bg-transparent border-outline"
              name="payment" type="radio" checked readOnly />
            <div className="flex-grow font-body text-on-surface font-medium">Credit card</div>
            <span className="material-symbols-outlined text-xl text-outline" data-icon="credit_card">credit_card</span>
          </div>

          <div className="p-6 border-t border-outline-variant/10 bg-surface space-y-6">
            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="cardNumber" placeholder="Card number" type="text"
                inputMode="numeric" maxLength={19} autoComplete="cc-number"
                value={form.cardNumber} onChange={handleCardNumber} onBlur={handleBlur('cardNumber')} />
              <label className={LABEL_CLASS} htmlFor="cardNumber">Card number</label>
              {showError('cardNumber') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardNumber')}</p>}
            </div>

            <div className="relative pt-4">
              <input className={INPUT_CLASS} id="cardName" placeholder="Cardholder name" type="text"
                autoComplete="cc-name" value={form.cardName} onChange={handleField('cardName')} onBlur={handleBlur('cardName')} />
              <label className={LABEL_CLASS} htmlFor="cardName">Cardholder name</label>
              {showError('cardName') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardName')}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative pt-4">
                <input className={INPUT_CLASS} id="cardExpiry" placeholder="MM/YY" type="text"
                  inputMode="numeric" maxLength={5} autoComplete="cc-exp"
                  value={form.cardExpiry} onChange={handleCardExpiry} onBlur={handleBlur('cardExpiry')} />
                <label className={LABEL_CLASS} htmlFor="cardExpiry">Expiry (MM/YY)</label>
                {showError('cardExpiry') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardExpiry')}</p>}
              </div>
              <div className="relative pt-4">
                <input className={INPUT_CLASS} id="cardCvv" placeholder="CVV" type="password"
                  inputMode="numeric" maxLength={4} autoComplete="cc-csc"
                  value={form.cardCvv} onChange={handleField('cardCvv')} onBlur={handleBlur('cardCvv')} />
                <label className={LABEL_CLASS} htmlFor="cardCvv">CVV</label>
                {showError('cardCvv') && <p role="alert" className="mt-1 text-xs text-red-500">{showError('cardCvv')}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

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
  );
}
