/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves this as a project site at /SydSocialRedux/, not the domain root.
  base: process.env.GITHUB_PAGES ? '/SydSocialRedux/' : '/',
  server: {
    port: 3000
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-core': ['firebase/app', 'firebase/auth', 'firebase/storage'],
          'firebase-firestore': ['firebase/firestore'],
          'firebase-appcheck': ['firebase/app-check', 'firebase/database'],
          'semantic-ui': ['semantic-ui-react'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
