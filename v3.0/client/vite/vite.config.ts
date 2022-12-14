/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // or 'jsdom', 'happy-dom', 'node'
  },
  resolve: {
    alias: {
      "@utils": path.resolve('./src/utils'),
      "@pages": path.resolve('./src/pages'),
      "@assets": path.resolve('./src/assets'),
      "@contexts": path.resolve('./src/contexts'),
      "@components": path.resolve('./src/components'),
    },
  },
})
