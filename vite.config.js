import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { sync } from 'glob';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const rootPath = resolve(process.cwd(), 'src/infrastructure/web/ui');

export default defineConfig({
  root: rootPath,
  resolve: {
    alias: {
      '~bootstrap': resolve(process.cwd(), 'node_modules/bootstrap'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
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
    minify: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: resolve(rootPath, 'assets', '*'),
          dest: 'public/assets',
        },
      ],
    }),
  ],
});
