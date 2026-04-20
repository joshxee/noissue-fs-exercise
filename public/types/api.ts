export type CartProduct = {
  sku: string;
  name: string;
  description: string;
  type: string;
  quantity: number;
  currency: string;
  symbol: string;
  total: number;
};

export type CartSupplierGroup = {
  supplierId: string;
  supplierName: string;
  products: CartProduct[];
  subtotal: number;
  currency: string;
  symbol: string;
};

export type CartData = {
  suppliers: CartSupplierGroup[];
  grandTotal: number;
  shippingTotal: number;
  currency: string;
  symbol: string;
};

export type CartResponse = {
  success: true;
  data: CartData;
};

export type ApiError = { code: string; message: string };

export type CartErrorResponse = {
  success: false;
  error: ApiError;
};

export type PurchaseOrderItem = {
  poId: number;
  productSku: string;
  quantity: number;
  total: number;
  productName: string;
  productType: string;
};

export type PurchaseOrder = {
  poId: number;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  itemTotal: number;
  shippingFee: number;
  orderTotal: number;
  currency: string;
  symbol: string;
};

export type CheckoutData = {
  purchaseOrders: PurchaseOrder[];
};

export type CheckoutResponse = {
  success: true;
  data: CheckoutData;
};

export type CheckoutErrorResponse = {
  success: false;
  error: ApiError;
};

export type ShippingAddress = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ConfirmationState = {
  purchaseOrders: PurchaseOrder[];
  shippingAddress: ShippingAddress;
};
