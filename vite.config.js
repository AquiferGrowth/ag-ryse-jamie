import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Generate a single JS file without a hash in the filename for easy CDN usage
    rollupOptions: {
      input: 'src/main.js',
      output: {
        entryFileNames: 'app.js',
        // Optional: Remove CSS if you only want JS, or output as a single CSS
        assetFileNames: 'app.[ext]'
      }
    },
    // Don't minify the HTML since we aren't deploying the HTML from here
    outDir: 'dist',
    emptyOutDir: true
  }
});
