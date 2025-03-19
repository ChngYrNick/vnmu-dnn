import path from 'node:path';
import { defineConfig } from 'vite';
import { sync } from 'glob';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const rootPath = path.resolve(process.cwd(), 'src/infrastructure/web/ui');

export default defineConfig(({ command }) => {
  return {
    root: rootPath,
    resolve: {
      alias: {
        '~bootstrap': path.resolve(process.cwd(), 'node_modules/bootstrap'),
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
      watch:
        command === 'build' && process.argv.includes('--watch') ? {} : null,
      outDir: path.resolve(process.cwd(), 'dist'),
      rollupOptions: {
        input: sync(path.resolve(rootPath, 'views', '**/*.html')),
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
            src: path.resolve(rootPath, 'assets', '*'),
            dest: 'public/assets',
          },
        ],
      }),
      {
        name: 'watch-external',
        buildStart() {
          this.addWatchFile(rootPath);
        },
        handleHotUpdate({ file, server }) {
          if (
            file.includes(path.join('views')) ||
            file.includes(path.join('assets'))
          ) {
            server.restart();
            return [];
          }
        },
      },
    ],
  };
});
