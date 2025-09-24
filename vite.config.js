import path from 'node:path';
import fs from 'node:fs';
import { defineConfig } from 'vite';
import { sync } from 'glob';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import * as PurgeCSS from 'purgecss';

const rootPath = path.resolve(process.cwd(), 'src/infrastructure/web/ui');

const viewsPath = path.resolve(rootPath, 'views');

function vitePurgeCSSPlugin() {
  return {
    name: 'vite-plugin-purgecss',
    enforce: 'post',
    async writeBundle(outputOptions, bundle) {
      const cssFiles = Object.keys(bundle).filter(
        (key) => key.endsWith('.css') && !key.includes('admin'),
      );

      for (const cssFile of cssFiles) {
        const filePath = path.join(outputOptions.dir, cssFile);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        const contentPaths = [
          path.resolve(viewsPath, 'layouts/base.html'),
          path.resolve(viewsPath, 'pages/*.html'),
          path.resolve(viewsPath, 'partials/**/*.html'),
        ];

        const contentFiles = [];
        for (const pattern of contentPaths) {
          try {
            const files = sync(pattern);
            contentFiles.push(...files);
          } catch (err) {
            console.warn(`Pattern matching error: ${pattern}`, err);
          }
        }

        const result = await new PurgeCSS.PurgeCSS().purge({
          content: contentFiles,
          css: [{ raw: fileContent }],
          safelist: {
            standard: [
              'html',
              'body',
              'show',
              'showing',
              'hiding',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
              'input',
              'form',
              'invisible-scrollbar',
            ],
            deep: [/offcanvas/],
            greedy: [/^offcanvas-/],
          },
        });

        // Write purged CSS back to file
        if (result.length > 0 && result[0].css) {
          fs.writeFileSync(filePath, result[0].css, 'utf8');
          console.log(`Purged CSS written to ${filePath}`);
        }
      }
    },
  };
}

export default defineConfig({
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
    vitePurgeCSSPlugin(),
  ],
});
