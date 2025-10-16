import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // for running outside docker
  // build: {
  //   outDir: '../dist',    // above vite react project root
  //   emptyOutDir: true,    // clears existing build directory
  // }
})
