import path from 'node:path';
import fs from 'node:fs/promises';

class QueryLoaderService {
  #store = new Map();
  #rootPath = '';

  constructor(rootPath) {
    this.#rootPath = rootPath;
  }

  async init() {
    await this.#load(this.#rootPath);
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
}

export { QueryLoaderService };
