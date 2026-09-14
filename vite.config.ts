/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/transfers/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/shared/lib/test/setup.ts'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
    },
  },
})
