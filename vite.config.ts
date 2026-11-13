import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  // The site is served from https://<user>.github.io/alpha-C4/
  base: '/alpha-C4/',
  plugins: [react(), tailwindcss()],
})
