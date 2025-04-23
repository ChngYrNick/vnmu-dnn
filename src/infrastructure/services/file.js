import fs from 'node:fs/promises';

class FileService {
  static async write({ data, filepath }) {
    const fileHandle = await fs.open(filepath, 'w');
    try {
      const writableStream = fileHandle.createWriteStream();
      await new Promise((resolve, reject) => {
        data.file.pipe(writableStream);
        writableStream.on('finish', resolve);
        writableStream.on('error', reject);
      });
    } finally {
      await fileHandle.close();
    }
  }

  static async delete(filepath) {
    await fs.unlink(filepath);
  }
}

export { FileService };
