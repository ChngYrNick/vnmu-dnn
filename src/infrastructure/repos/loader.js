import path from 'node:path';
import fs from 'node:fs/promises';

class SQLLoaderService {
  #store = {};
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
        return this.#load(fullPath);
      }

      if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.sql') {
        const content = await fs.readFile(fullPath, 'utf8');
        this.#store[fullPath] = content;
      }
    }
  }

  get(filePath) {
    return this.#store[path.join(this.#rootPath, filePath)];
  }
}

export { SQLLoaderService };
