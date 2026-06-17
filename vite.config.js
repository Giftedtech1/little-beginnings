import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use esbuild for minification (faster than terser, already built-in)
    minify: 'esbuild',
    // Raise the warning limit slightly — we know hero images are large
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split large dependencies into separate chunks so they can be cached independently
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  // Optimise dependency pre-bundling during dev
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
  },
})

