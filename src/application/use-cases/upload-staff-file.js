import crypto from 'node:crypto';
import path from 'node:path';
import { Roles } from '../../domain/roles.js';
import { ForbiddenError } from '../../domain/errors/forbidden.js';

class UploadStaffFileUseCase {
  #staffFileRepo = null;
  #filesRepo = null;
  #fileService = null;
  #sessionsService = null;

  constructor({ staffFileRepo, filesRepo, fileService, sessionsService }) {
    this.#staffFileRepo = staffFileRepo;
    this.#filesRepo = filesRepo;
    this.#fileService = fileService;
    this.#sessionsService = sessionsService;
  }

  async exec({ staffId, data }) {
    const user = await this.#sessionsService.getCurrentUser();
    if (!user || user.role !== Roles.ADMIN) {
      throw new ForbiddenError();
    }

    // Delete existing profile picture (single picture mode)
    await this.#staffFileRepo.deleteByStaffId(staffId);

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
    const { fileId } = await this.#staffFileRepo.create(staffId, fileDto);
    return { id: fileId, ...fileDto };
  }
}

export { UploadStaffFileUseCase };
