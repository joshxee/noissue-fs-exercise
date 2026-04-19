import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { resolve } from 'path'
import index from '../public/index.html'

const app = new Elysia()
  .use(staticPlugin({ prefix: '/', assets: resolve(import.meta.dir, '../public'), alwaysStatic: false }))
  .get('/*', index)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
