import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],

  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in production for security
    minify: 'terser',
    chunkSizeWarningLimit: 1000
  },

  // Development server
  server: {
    host: '0.0.0.0', // Important for Docker!
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true // Important for Docker hot reload!
    },
    hmr: {
      clientPort: 5173 // HMR port
    }
  },

  // Preview server (for testing production build)
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true
  }
})
