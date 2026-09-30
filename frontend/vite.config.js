import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration - proxy API calls to backend during development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
