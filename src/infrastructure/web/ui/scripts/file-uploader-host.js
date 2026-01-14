import { VNMUFileUploaderComponent } from './file-uploader.js';

class FileService {
  #endpoint = null;

  constructor(endpoint) {
    this.#endpoint = endpoint;
  }

  static endpoints = {
    pageId: {
      read: (id) => `/content/uploads/${id}`,
      upload: (id) => `/admin/content/uploads/${id}`,
      delete: (id) => `/uploads/${id}`,
    },
    materialId: {
      read: (id) => `/content/material/${id}`,
      upload: (id) => `/admin/material/uploads/${id}`,
      delete: (id) => `/uploads/${id}`,
    },
  };

  async read(id) {
    const result = await fetch(this.#endpoint.read(id));
    const files = await result.json();
    return files.map((file) => FileMapper.fromPersistent(file));
  }

  async delete(id) {
    return fetch(this.#endpoint.delete(id), { method: 'DELETE' });
  }

  upload(id, file) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file.payload);
    xhr.open('POST', this.#endpoint.upload(id), true);
    // TODO: Temp fix to make progress display work.
    xhr.upload.onprogress = () => {};
    xhr.send(formData);
    return xhr;
  }

  static from(key) {
    return new FileService(FileService.endpoints[key]);
  }
}

class FileMapper {
  static fromPersistent(data) {
    return { status: 'complete', progress: 0, data, payload: null };
  }

  static fromFile(data) {
    return {
      status: 'loading',
      progress: 0,
      data: {
        id: crypto.getRandomValues(new Uint32Array(1))[0],
        filename: data.name,
        originalFilename: data.name,
        mimetype: data.type,
        size: data.size,
        path: '',
        filepath: '',
      },
      payload: data,
    };
  }
}

class VNMUFileUploaderHostComponent extends HTMLElement {
  static tagName = 'vnmu-file-uploader-host';
  #abortController = new AbortController();
  #fileService = null;
  #id = null;
  #idKey = null;
  #files = [];
  #fileUploaderElem = null;
  #errorElem = null;

  async connectedCallback() {
    this.#fileUploaderElem = VNMUFileUploaderComponent.from(this.#files);
    this.#errorElem = this.#createErrorElem();
    this.#updateError();
    this.appendChild(this.#fileUploaderElem);
    this.appendChild(this.#errorElem);
    this.#updateId();
    this.#fileService = FileService.from(this.#idKey);
    this.#files = await this.#fileService.read(this.#id);
    this.#fileUploaderElem.updateFiles(this.#files);
    this.#setupEventListeners();
  }

  #createErrorElem() {
    const errorElem = document.createElement('div');
    errorElem.classList.add('alert', 'alert-danger', 'mt-3');
    errorElem.role = 'alert';
    return errorElem;
  }

  #updateError(error) {
    this.#errorElem.classList.add('d-none');
    this.#errorElem.innerText = '';
    if (error) {
      this.#errorElem.classList.remove('d-none');
      this.#errorElem.innerText = error.description;
    }
  }

  #handleImageFile(data) {
    const abortController = new AbortController();
    const file = FileMapper.fromFile(data);
    let fileReader = new FileReader();

    fileReader.addEventListener(
      'load',
      (event) => {
        const fileIndex = this.#findFileIndex(file.data.id);

        if (fileIndex !== -1 && this.#files[fileIndex].status !== 'complete') {
          this.#files[fileIndex].path = event.target.result;
        }

        abortController.abort();
        fileReader = null;
      },
      { signal: abortController.signal },
    );

    fileReader.addEventListener(
      'error',
      () => {
        abortController.abort();
        fileReader = null;
      },
      {
        signal: abortController.signal,
      },
    );

    this.addEventListener(
      'destroy',
      () => {
        abortController.abort();
        fileReader = null;
      },
      {
        signal: abortController.signal,
      },
    );

    this.#files.push(file);
    this.#addFileToList(file);
    fileReader.readAsDataURL(data);
    this.#uploadFile(file);
  }

  #handleFile(data) {
    if (data.type.startsWith('image')) {
      this.#handleImageFile(data);
      return;
    }
    const file = FileMapper.fromFile(data);
    this.#files.push(file);
    this.#addFileToList(file);
    this.#uploadFile(file);
  }

  #uploadFile(file) {
    const abortController = new AbortController();
    let xhr = this.#fileService.upload(this.#id, file);

    xhr.addEventListener(
      'load',
      () => {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          this.#handleFileUpload(file.data.id, data);
        } else {
          this.#updateError(data);
          this.#updateFileStatus(file.data.id, 'failed');
        }
        abortController.abort();
        xhr = null;
      },
      { signal: abortController.signal },
    );

    xhr.addEventListener(
      'error',
      () => {
        this.#updateFileStatus(file.data.id, 'failed');
        abortController.abort();
        xhr = null;
      },
      { signal: abortController.signal },
    );

    xhr.upload.addEventListener(
      'progress',
      (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          this.#updateFileProgress(file.data.id, progress);
        }
      },
      {
        signal: abortController.signal,
      },
    );

    this.addEventListener(
      'destroy',
      () => {
        abortController.abort();
        xhr = null;
      },
      {
        signal: abortController.signal,
      },
    );
  }

  #setupEventListeners() {
    this.addEventListener(
      'files-change',
      (event) => {
        const files = event.detail;
        this.#updateError();
        Array.from(files).forEach((file) => this.#handleFile(file));
      },
      {
        signal: this.#abortController.signal,
        capture: true,
      },
    );

    this.addEventListener(
      'delete-file',
      async (event) => {
        const index = this.#findFileIndex(event.detail);
        const file = this.#files[index];
        this.#updateError();
        if (file.status !== 'complete') {
          this.#removeFileFromList(file.data.id);
          return;
        }
        this.#updateFileStatus(file.data.id, 'loading');
        const result = await this.#fileService.delete(file.data.id);
        if (result.status !== 200) {
          this.#updateError(await result.json());
          this.#updateFileStatus(file.data.id, 'complete');
          return;
        }
        this.#removeFileFromList(file.data.id);
      },
      {
        signal: this.#abortController.signal,
        capture: true,
      },
    );
  }

  #findFileIndex(fileId) {
    return this.#files.findIndex((item) => item.data.id === fileId);
  }

  #handleFileUpload(fileId, data) {
    const fileIndex = this.#findFileIndex(fileId);
    if (fileIndex !== -1) {
      this.#files[fileIndex].data = data;
      this.#files[fileIndex].status = 'complete';
      const file = this.#files[fileIndex];
      this.#fileUploaderElem.updateFile(fileId, file);
    }
  }

  #updateFileProgress(fileId, progress) {
    const fileIndex = this.#findFileIndex(fileId);
    if (fileIndex !== -1) {
      this.#files[fileIndex].progress = progress;
      const file = this.#files[fileIndex];
      this.#fileUploaderElem.updateFileProgress(fileId, file);
    }
  }

  #updateFileStatus(fileId, status) {
    const fileIndex = this.#findFileIndex(fileId);
    if (fileIndex !== -1) {
      this.#files[fileIndex].status = status;
      const file = this.#files[fileIndex];
      this.#fileUploaderElem.updateFile(fileId, file);
    }
  }

  #removeFileFromList(fileId) {
    const fileIndex = this.#findFileIndex(fileId);
    if (fileIndex !== -1) {
      this.#files.splice(fileIndex, 1);
      this.#fileUploaderElem.removeFile(fileId);
    }
  }

  #addFileToList(file) {
    this.#fileUploaderElem.addFile(file);
  }

  #updateId() {
    if (this.getAttribute('page-id')) {
      this.#id = this.getAttribute('page-id');
      this.#idKey = 'pageId';
    } else if (this.getAttribute('material-id')) {
      this.#id = this.getAttribute('material-id');
      this.#idKey = 'materialId';
    }
  }

  disconnectedCallback() {
    const destroyEvent = new CustomEvent('destroy');
    this.dispatchEvent(destroyEvent);
    this.#abortController.abort();
  }

  static from() {
    return document.createElement(VNMUFileUploaderHostComponent.tagName);
  }
}

export { VNMUFileUploaderHostComponent };
