import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { resolve } from 'path'
import index from '../public/index.html'

// Import database seeder and routes
import { seedDatabase } from './db/seed';
import { cartRoute } from './routes/cart';
import { checkoutRoute } from './routes/checkout';

// Seed the database on startup
seedDatabase();

const app = new Elysia()
  .use(staticPlugin({ prefix: '/', assets: resolve(import.meta.dir, '../public'), alwaysStatic: false }))
  .use(cartRoute)
  .use(checkoutRoute)
  .get('/*', index)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

