import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  resolve: {
    // Plugins import the host SDK by name; tests resolve it to a local double.
    alias: { '@orgasmic/plugin-sdk': new URL('./test/plugin-sdk.js', import.meta.url).pathname },
  },
  test: {
    environment: 'jsdom',
    include: ['plugins/*/test/**/*.test.jsx'],
  },
});
