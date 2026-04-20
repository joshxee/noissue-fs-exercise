import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const products = sqliteTable('products', {
  sku: text('sku').primaryKey(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  description: text('description'),
});

export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productSku: text('product_sku').notNull().references(() => products.sku),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  quantity: integer('quantity').notNull(),
  currency: text('currency').notNull(),
  symbol: text('symbol').notNull(),
  total: real('total').notNull(),
});

export const shippingFees = sqliteTable('shipping_fees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  currency: text('currency').notNull(),
  symbol: text('symbol').notNull(),
  total: real('total').notNull(),
});

export const purchaseOrders = sqliteTable('purchase_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  supplierId: text('supplier_id').notNull().references(() => suppliers.id),
  itemTotal: real('item_total').notNull(),
  shippingFee: real('shipping_fee').notNull(),
  orderTotal: real('order_total').notNull(),
  currency: text('currency').notNull(),
  symbol: text('symbol').notNull(),
});

export const purchaseOrderItems = sqliteTable('purchase_order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  poId: integer('po_id').notNull().references(() => purchaseOrders.id),
  productSku: text('product_sku').notNull(), // Can reference products.sku if we want, but fine as text
  quantity: integer('quantity').notNull(),
  total: real('total').notNull(),
});
