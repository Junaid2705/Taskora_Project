import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // sockjs-client references `global`, which doesn't exist in the browser/Vite.
  define: {
    global: 'globalThis',
  },
})
