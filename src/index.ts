import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { resolve } from 'path'
import index from '../public/index.html'

import { seedDatabase } from './db/seed';
import { cartRoute } from './routes/cart';
import { checkoutRoute } from './routes/checkout';

seedDatabase();

const requestTimes = new WeakMap<Request, number>();
const PORT = Number(process.env.PORT ?? 3000);

const app = new Elysia()
  .onBeforeHandle(({ request }) => {
    requestTimes.set(request, Date.now());
  })
  .onAfterHandle(({ request, set }) => {
    const path = new URL(request.url).pathname;
    if (!path.startsWith('/api')) return;
    const start = requestTimes.get(request);
    requestTimes.delete(request);
    console.log(JSON.stringify({
      ts: new Date().toISOString(),
      method: request.method,
      path,
      status: set.status ?? 200,
      durationMs: start !== undefined ? Date.now() - start : undefined,
    }));
  })
  .onError(({ request, error, set }) => {
    console.error(JSON.stringify({
      ts: new Date().toISOString(),
      method: request.method,
      path: new URL(request.url).pathname,
      status: set.status ?? 500,
      error: error instanceof Error ? error.message : String(error),
    }));
  })
  .use(staticPlugin({ prefix: '/', assets: resolve(import.meta.dir, '../public'), alwaysStatic: false }))
  .use(cartRoute)
  .use(checkoutRoute)
  .get('/*', index)
  .listen(PORT);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

