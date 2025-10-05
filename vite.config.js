import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps for smaller build
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
  },
  server: {
    port: 5173,
    host: true // Allow external access
  },
  // Add this for client-side routing
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})