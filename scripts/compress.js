import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { promisify } from 'node:util';

const brotliCompressAsync = promisify(zlib.brotliCompress);

const distDir = path.join(process.cwd(), 'dist');

const extensions = ['.js', '.css', '.html', '.svg', '.json'];

const brotliOptions = {
  params: {
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
  },
};

const compressFiles = async (directory) => {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await compressFiles(filePath);
    } else if (extensions.includes(path.extname(file))) {
      const content = fs.readFileSync(filePath);
      const compressed = await brotliCompressAsync(content, brotliOptions);
      fs.writeFileSync(`${filePath}.br`, compressed);
    }
  }
};

compressFiles(distDir);
