import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.test.ts'],
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: false,
  target: 'es2020',
  splitting: false,
  bundle: false,
})
