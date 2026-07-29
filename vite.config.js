import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Keep the generated entrypoints portable when the site is mounted below the domain root.
  base: './',
  plugins: [react()],
})
