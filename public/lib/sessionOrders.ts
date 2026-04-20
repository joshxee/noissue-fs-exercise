import type { PurchaseOrder, ShippingAddress } from '../types/api';

export type SessionOrder = {
  id: string;
  placedAt: string;
  purchaseOrders: PurchaseOrder[];
  shippingAddress: ShippingAddress;
};

const SESSION_KEY = 'noissue_session_orders';

function readOrders(): SessionOrder[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionOrder[]) : [];
  } catch {
    return [];
  }
}

export function getSessionOrders(): SessionOrder[] {
  return readOrders();
}

export function appendSessionOrder(
  purchaseOrders: PurchaseOrder[],
  shippingAddress: ShippingAddress
): SessionOrder[] {
  const existing = readOrders();
  const newOrder: SessionOrder = {
    id: crypto.randomUUID(),
    placedAt: new Date().toISOString(),
    purchaseOrders,
    shippingAddress,
  };
  const updated = [...existing, newOrder];
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  } catch {
    // sessionStorage unavailable or quota exceeded — degrade silently
  }
  return updated;
}
