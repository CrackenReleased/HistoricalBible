import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        interact: resolve(__dirname, 'interact.html'),
        bible: resolve(__dirname, 'bible.html'),
        contact: resolve(__dirname, 'contact.html'),
        tapestry: resolve(__dirname, 'tapestry.html'),
        interactDir: resolve(__dirname, 'interact/index.html'),
        bibleDir: resolve(__dirname, 'bible/index.html'),
        contactDir: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
