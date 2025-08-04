import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-select'],
          charts: ['recharts'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          analytics: ['react-ga4', 'web-vitals'],
          supabase: ['@supabase/supabase-js'],
        },
        // Add cache-busting for production
        entryFileNames: (chunkInfo) => {
          return `assets/[name]-[hash].js`;
        },
        chunkFileNames: (chunkInfo) => {
          return `assets/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
    // Optimize for mobile performance
    chunkSizeWarningLimit: 500,
    // Inline smaller assets for fewer requests
    assetsInlineLimit: 2048,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable source maps for production debugging
    sourcemap: false,
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
  },
}));
