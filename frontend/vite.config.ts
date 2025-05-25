import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

//const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    //https: isProd ? true : false, // Activer HTTPS en prod
    https: false, // Activer HTTPS en prod
    //  {
    //  key: fs.readFileSync('./certs/key.pem'),
    //  cert: fs.readFileSync('./certs/cert.pem'),
    //},
    allowedHosts: ['visioprof.fr', 'www.visioprof.fr', 'localhost', '127.0.0.1', '0.0.0.0'],
    proxy: {
      '/api': {
        target: 'http://nginx', // Redirige vers Nginx (qui envoie à backend:5000)
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    css: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
