import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { CheckoutErrorResponse, CheckoutResponse, ShippingAddress, ConfirmationState } from '../../types/api';
import { appendSessionOrder } from '../../lib/sessionOrders';

export type FormState = {
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

export type FormErrors = Partial<Record<keyof FormState, string>>;
export type TouchedFields = Partial<Record<keyof FormState, boolean>>;

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string };

export type CheckoutFormResult = {
  form: FormState;
  touched: TouchedFields;
  submitState: SubmitState;
  submitAttempted: boolean;
  shippingSelected: boolean;
  setShippingSelected: (v: boolean) => void;
  formErrors: FormErrors;
  canSubmit: boolean;
  handleField: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckbox: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCardNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCardExpiry: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof FormState) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
  showError: (field: keyof FormState) => string | undefined;
};

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

  if (!form.cardName.trim()) errors.cardName = 'Cardholder name is required';

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

export function useCheckoutForm(): CheckoutFormResult {
  const navigate = useNavigate();
  const [form, setForm] = React.useState<FormState>(INITIAL_FORM);
  const [touched, setTouched] = React.useState<TouchedFields>({});
  const [submitState, setSubmitState] = React.useState<SubmitState>({ status: 'idle' });
  const [shippingSelected, setShippingSelected] = React.useState(true);
  const [submitAttempted, setSubmitAttempted] = React.useState(false);

  const formErrors = React.useMemo(() => validateForm(form), [form]);
  const canSubmit = Object.keys(formErrors).length === 0 && shippingSelected;

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
        if (res.status === 409) throw new Error('already_checked_out');
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
          setSubmitState({ status: 'error', message: json.error.message });
        }
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error && err.message === 'already_checked_out'
            ? 'This order has already been placed. Please refresh to start a new cart.'
            : 'Checkout failed. Please try again.';
        setSubmitState({ status: 'error', message });
      });
  };

  return {
    form,
    touched,
    submitState,
    submitAttempted,
    shippingSelected,
    setShippingSelected,
    formErrors,
    canSubmit,
    handleField,
    handleCheckbox,
    handleCardNumber,
    handleCardExpiry,
    handleBlur,
    handleSubmit,
    showError,
  };
}
