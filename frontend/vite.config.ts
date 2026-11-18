import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@contract': path.resolve(import.meta.dirname, '../contract'),
    },
  },
  // Allow importing the shared /contract folder from outside frontend/
  server: { fs: { allow: ['..'] } },
})
