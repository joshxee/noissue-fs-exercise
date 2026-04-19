import { Elysia } from "elysia";
import { staticPlugin } from '@elysiajs/static'
import { resolve } from 'path'

const app = new Elysia()
  .use(await staticPlugin({ prefix: '/', assets: resolve(import.meta.dir, '../public') }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
