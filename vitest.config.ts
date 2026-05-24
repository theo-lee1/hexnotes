import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      provider: 'playwright',
      options: {
        headless: true,
      },
    },
    globals: true,
  },
});