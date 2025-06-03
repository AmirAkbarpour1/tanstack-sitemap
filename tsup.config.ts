import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
  target: 'es2020',
  splitting: false,
  bundle: true,
})
