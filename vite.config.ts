import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const isDevelopment = mode === 'development';

    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.API_URL': JSON.stringify(
          isDevelopment
            ? 'http://localhost:3001'
            : env.VITE_API_URL || ''
        )
      },
      server: {
        proxy: isDevelopment ? {
          '/api': {
            target: env.VITE_API_URL || 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
        } : undefined,
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: mode !== 'production',
        minify: mode === 'production' ? 'terser' : false,
        terserOptions: mode === 'production' ? {
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        } : undefined,
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui-vendor': ['lucide-react', 'framer-motion', 'recharts'],
              'form-vendor': ['react-hook-form', 'axios']
            }
          }
        },
        chunkSizeWarningLimit: 1000
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'axios']
      }
    };
});
