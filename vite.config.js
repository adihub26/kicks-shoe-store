import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ← ADD THIS LINE (crucial for Vercel deployment)
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})