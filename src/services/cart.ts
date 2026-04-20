import { readFileSync } from 'fs';
import { resolve } from 'path';
import { db } from '../db/db';
import { cartItems } from '../db/schema';

type CartJsonProduct = {
  productSku: string;
  productQuantity: string;
  supplier: { supplierId: string };
  payment: { currency: string; symbol: string; total: string };
};

const normalizeSupplierId = (id: string) => id.replace(/^0+/, '');

function loadCartProducts(): CartJsonProduct[] {
  const cartPath = resolve(process.cwd(), 'cart.json');
  const cartData = JSON.parse(readFileSync(cartPath, 'utf8'));
  return cartData.products as CartJsonProduct[];
}

export function seedRandomCart(): void {
  db.delete(cartItems).run();

  const allProducts = loadCartProducts();
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  const count = 2 + Math.floor(Math.random() * (allProducts.length - 1));
  const selected = shuffled.slice(0, count);

  for (const item of selected) {
    db.insert(cartItems).values({
      productSku: item.productSku,
      supplierId: normalizeSupplierId(item.supplier.supplierId),
      quantity: parseInt(item.productQuantity, 10),
      currency: item.payment.currency,
      symbol: item.payment.symbol,
      total: parseFloat(item.payment.total),
    }).execute();
  }
}
