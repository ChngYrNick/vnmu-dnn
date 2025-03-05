import { resolve } from 'path';
import { defineConfig } from 'vite';
import { sync } from 'glob';

const rootPath = resolve(process.cwd(), 'src/infrastructure/web/ui');

export default defineConfig({
  root: rootPath,
  build: {
    outDir: resolve(process.cwd(), 'dist'),
    rollupOptions: {
      input: sync(resolve(rootPath, 'views', '**/*.html')),
      output: {
        assetFileNames: (assetInfo) => {
          if (/\.(css)$/.test(assetInfo.names.at(0))) {
            return 'public/styles/[name]-[hash].[ext]';
          }
          return 'public/assets/[name]-[hash].[ext]';
        },
        entryFileNames: 'public/scripts/[name]-[hash].js',
        chunkFileNames: 'public/scripts/[name]-[hash].js',
      },
    },
    emptyOutDir: true,
    minify: true,
  },
});
