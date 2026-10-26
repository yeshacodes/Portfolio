
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        // Only the portfolio (the darkroom, at /) is published. The earlier prototypes (studio.html, city.html,
        // reverse.html, and darkroom.html, a duplicate of /) stay in the repo and still open on the dev server; to
        // publish one again, add it back here, e.g. studio: path.resolve(__dirname, 'studio.html').
        input: { main: path.resolve(__dirname, 'index.html') },
      },
    },
    server: {
      port: Number(process.env.PORT) || 3000,
      open: true,
    },
  });