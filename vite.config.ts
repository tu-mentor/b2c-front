import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    // Configuración para evitar problemas de caché
    rollupOptions: {
      output: {
        // Agregar hash a los nombres de archivos para invalidar caché
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
