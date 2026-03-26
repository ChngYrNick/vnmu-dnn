import path from 'node:path';
import fs from 'node:fs/promises';
import { watch } from 'node:fs';

class QueryLoaderService {
  #store = new Map();
  #rootPath = '';
  #watcher = null;

  constructor(rootPath) {
    this.#rootPath = rootPath;
  }

  async init() {
    await this.#load(this.#rootPath);

    if (process.env.NODE_ENV !== 'production') {
      this.#watch();
    }
  }

  #watch() {
    this.#watcher = watch(
      this.#rootPath,
      { recursive: true },
      async (eventType, filename) => {
        if (!filename || !filename.endsWith('.sql')) return;

        const fullPath = path.join(this.#rootPath, filename);
        try {
          const content = await fs.readFile(fullPath, 'utf8');
          this.#store.set(filename, content);
        } catch {
          this.#store.delete(filename);
        }
      },
    );
  }

  async #load(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await this.#load(fullPath);
      }

      if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.sql') {
        const content = await fs.readFile(fullPath, 'utf8');
        const relativePath = path.relative(this.#rootPath, fullPath);
        this.#store.set(relativePath, content);
      }
    }
  }

  get(filePath) {
    return this.#store.get(filePath);
  }

  close() {
    this.#watcher?.close();
  }
}

export { QueryLoaderService };
