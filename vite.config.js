import path from 'node:path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const rootPath = path.resolve(process.cwd(), 'src/infrastructure/web/ui');

export default defineConfig({
  root: rootPath,
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(rootPath, 'scripts/main.js'),
        admin: path.resolve(rootPath, 'scripts/admin.js'),
        error: path.resolve(rootPath, 'scripts/error.js'),
      },
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
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 8080,
      path: '/@vite/ws',
    },
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
  ],
});
