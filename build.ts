import tailwind from 'bun-plugin-tailwind'

await Bun.build({
  entrypoints: ['public/index.tsx'],
  outdir: 'public/dist',
  target: 'browser',
  plugins: [tailwind],
})
