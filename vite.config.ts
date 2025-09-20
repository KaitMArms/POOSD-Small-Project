import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    proxy: {
      '/LAMPAPI': {
        target: 'https://luisalban.xyz',
        changeOrigin: true,
        secure: false
      }
    }
  }
})