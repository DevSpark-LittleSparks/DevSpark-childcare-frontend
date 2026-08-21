import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    // sockjs-client (used by the messaging feature) references Node's
    // `global`, which the browser doesn't have.
    global: 'globalThis',
  },
})
