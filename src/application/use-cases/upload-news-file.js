import crypto from 'node:crypto';
import path from 'node:path';
import { Roles } from '../../domain/roles.js';
import { ForbiddenError } from '../../domain/errors/forbidden.js';
import { BadRequestError } from '../../domain/errors/bad-request.js';

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

class UploadNewsFileUseCase {
  #newsFileRepo = null;
  #filesRepo = null;
  #fileService = null;
  #sessionsService = null;

  constructor({ newsFileRepo, filesRepo, fileService, sessionsService }) {
    this.#newsFileRepo = newsFileRepo;
    this.#filesRepo = filesRepo;
    this.#fileService = fileService;
    this.#sessionsService = sessionsService;
  }

  async exec({ newsId, data }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }
    if (data.file.bytesRead > MAX_FILE_SIZE) {
      throw new BadRequestError(BadRequestError.FILE_SIZE_LIMIT);
    }

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
    const { fileId } = await this.#newsFileRepo.create(newsId, fileDto);
    return { id: fileId, ...fileDto };
  }
}

export { UploadNewsFileUseCase };
