import fs from 'node:fs';
import path from 'node:path';

const isDev = process.env.NODE_ENV !== 'production';
let manifest = null;

function readManifest() {
  if (manifest) return manifest;
  const manifestPath = path.join(process.cwd(), 'dist/.vite/manifest.json');
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  return manifest;
}

function vite(entrypoint) {
  if (isDev) {
    return (
      '<script type="module" src="/@vite/client"></script>\n' +
      `<script type="module" src="/${entrypoint}"></script>`
    );
  }

  const m = readManifest();
  const entry = m[entrypoint];
  if (!entry) {
    throw new Error(`Vite manifest entry not found: ${entrypoint}`);
  }

  let html = '';
  if (entry.css) {
    for (const cssFile of entry.css) {
      html += `<link rel="stylesheet" crossorigin href="/${cssFile}">\n`;
    }
  }
  if (entry.imports) {
    for (const importKey of entry.imports) {
      const chunk = m[importKey];
      if (chunk) {
        if (chunk.css) {
          for (const cssFile of chunk.css) {
            html += `<link rel="stylesheet" crossorigin href="/${cssFile}">\n`;
          }
        }
        html += `<link rel="modulepreload" crossorigin href="/${chunk.file}">\n`;
      }
    }
  }
  html += `<script type="module" crossorigin src="/${entry.file}"></script>`;
  return html;
}

export { vite };
