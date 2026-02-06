import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: '0.0.0.0',        // bind ke semua interface
    port: 5173,
    strictPort: true,

    allowedHosts: [
      'localhost',
      'rating-day.nathanellodar.my.id'  // ganti dengan domain kamu
    ],

    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
