import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': '"production"' },
  build: {
    outDir: 'dist/embed',
    lib: {
      entry: 'src/embed.tsx',
      name: 'FeedbackWidget',
      formats: ['iife'],
      fileName: () => 'feedback-widget.js',
    },
  },
});
