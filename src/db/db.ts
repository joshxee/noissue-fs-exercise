import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import * as schema from './schema';

// Use an in-memory SQLite database
const sqlite = new Database(':memory:');

// Initialize drizzle with the sqlite connection and the schema
export const db = drizzle(sqlite, { schema });

// Helper to run queries that create the tables
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS products (
      sku TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    );
    
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_sku TEXT NOT NULL,
      supplier_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      currency TEXT NOT NULL,
      symbol TEXT NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (product_sku) REFERENCES products(sku),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );
    
    CREATE TABLE IF NOT EXISTS shipping_fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id TEXT NOT NULL,
      currency TEXT NOT NULL,
      symbol TEXT NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );
    
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id TEXT NOT NULL,
      item_total REAL NOT NULL,
      shipping_fee REAL NOT NULL,
      order_total REAL NOT NULL,
      currency TEXT NOT NULL,
      symbol TEXT NOT NULL,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );
    
    CREATE TABLE IF NOT EXISTS purchase_order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      po_id INTEGER NOT NULL,
      product_sku TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (po_id) REFERENCES purchase_orders(id)
    );
  `);
}
