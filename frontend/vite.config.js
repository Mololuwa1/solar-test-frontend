import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Import the path module



// https://vitejs.dev/config/
export default defineConfig({
  base: '/static/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
 resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['chart.js', 'react-chartjs-2'],
            maps: ['leaflet']
          }
        }
      }
    },
   
  optimizeDeps: {
    include: ['leaflet', 'chart.js', 'react-chartjs-2']
  }
})

