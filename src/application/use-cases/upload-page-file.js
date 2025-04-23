import crypto from 'node:crypto';
import path from 'node:path';

class UploadPageFileUseCase {
  #pagesFileRepo = null;
  #filesRepo = null;
  #fileService = null;

  constructor({ pagesFileRepo, filesRepo, fileService }) {
    this.#pagesFileRepo = pagesFileRepo;
    this.#filesRepo = filesRepo;
    this.#fileService = fileService;
  }
  async exec({ pageId, data }) {
    const existingFile = await this.#filesRepo.readByFilename(data.filename);
    const [randomId] = crypto.getRandomValues(new Uint32Array(1));
    const filename = existingFile
      ? `${randomId}-${data.filename}`
      : data.filename;
    const filepath = path.join('uploads', filename);
    const fileDto = {
      filename,
      originalFilename: data.filename,
      mimetype: data.mimetype,
      size: data.file.bytesRead,
      path: path.join('/', filepath),
      filepath,
    };
    await this.#fileService.write({ data, filepath });
    const { fileId } = await this.#pagesFileRepo.create(pageId, fileDto);
    return { id: fileId, ...fileDto };
  }
}

export { UploadPageFileUseCase };
