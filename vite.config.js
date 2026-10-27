import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Las rutas relativas funcionan tanto en GitHub Pages como en localhost.
  base: './',
})
