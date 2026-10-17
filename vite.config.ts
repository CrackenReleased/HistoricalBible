import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';
import { createReadStream, copyFileSync, existsSync, statSync } from 'fs';

function serveAndCopyRootBiblePdf(): Plugin {
  const rootPdfPath = resolve(__dirname, 'Bible.pdf');

  const servePdfMiddleware = (req: { url?: string }, res: any, next: () => void) => {
    const cleanUrl = (req.url || '').split('?')[0];
    if (cleanUrl === '/Bible.pdf' && existsSync(rootPdfPath)) {
      const stat = statSync(rootPdfPath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', String(stat.size));
      createReadStream(rootPdfPath).pipe(res);
      return;
    }
    next();
  };

  return {
    name: 'serve-and-copy-root-bible-pdf',
    configureServer(server) {
      server.middlewares.use(servePdfMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(servePdfMiddleware);
    },
    closeBundle() {
      const distPdfPath = resolve(__dirname, 'dist', 'Bible.pdf');
      if (existsSync(rootPdfPath) && existsSync(resolve(__dirname, 'dist'))) {
        copyFileSync(rootPdfPath, distPdfPath);
      }
    },
  };
}

export default defineConfig({
  plugins: [serveAndCopyRootBiblePdf()],
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
        map: resolve(__dirname, 'map.html'),
        contact: resolve(__dirname, 'contact.html'),
        tapestry: resolve(__dirname, 'tapestry.html'),
        interactDir: resolve(__dirname, 'interact/index.html'),
        bibleDir: resolve(__dirname, 'bible/index.html'),
        mapDir: resolve(__dirname, 'map/index.html'),
        contactDir: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
