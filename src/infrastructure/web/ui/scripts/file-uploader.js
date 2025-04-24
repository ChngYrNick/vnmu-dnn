class VNMUFileUploaderComponent extends HTMLElement {
  static tagName = 'vnmu-file-uploader';

  #abortController = new AbortController();
  #fileInputElem = null;
  #previewContainerElem = null;
  #items = new Map();

  #handleRemoveItem(fileId) {
    const event = new CustomEvent('delete-file', { detail: fileId });
    this.dispatchEvent(event);
  }

  #createFileInputElem() {
    const fileInputElem = document.createElement('input');
    fileInputElem.type = 'file';
    fileInputElem.classList.add('d-none');
    fileInputElem.multiple = true;
    fileInputElem.addEventListener(
      'change',
      () => {
        this.#handleFilesChange(fileInputElem.files);
        fileInputElem.value = '';
      },
      { signal: this.#abortController.signal },
    );

    return fileInputElem;
  }

  #createUploadTileElem() {
    const uploadTileElem = document.createElement('div');
    const imgElem = document.createElement('img');
    const textElem = document.createElement('p');
    const fileInputElem = this.#createFileInputElem();
    uploadTileElem.classList.add('upload-tile');
    imgElem.classList.add('upload-icon');
    imgElem.height = 20;
    imgElem.src = '/public/assets/icons/upload.svg';
    imgElem.alt = 'upload';
    textElem.innerText = 'Add Files';
    uploadTileElem.appendChild(imgElem);
    uploadTileElem.appendChild(textElem);
    uploadTileElem.appendChild(fileInputElem);
    uploadTileElem.addEventListener(
      'click',
      () => void this.#fileInputElem.click(),
      { signal: this.#abortController.signal },
    );
    return uploadTileElem;
  }

  #createContainerElem() {
    const containerElem = document.createElement('div');
    const cardElem = document.createElement('div');
    const cardBodyElem = document.createElement('div');
    const previewContainerElem = document.createElement('div');
    const uploadTileElem = this.#createUploadTileElem();
    containerElem.classList.add('container-fluid', 'p-0');
    cardElem.classList.add('card', 'border-1');
    cardBodyElem.classList.add('card-body', 'p-3');
    previewContainerElem.classList.add('preview-container');
    previewContainerElem.appendChild(uploadTileElem);
    cardBodyElem.appendChild(previewContainerElem);
    cardElem.appendChild(cardBodyElem);
    containerElem.appendChild(cardElem);
    return containerElem;
  }

  #createProgressElem(item) {
    const progressElem = document.createElement('div');
    const progressBarElem = document.createElement('div');
    progressElem.classList.add('file-progress');
    progressBarElem.classList.add('file-progress-bar');
    progressBarElem.style.width = `${item.progress}%`;
    progressElem.appendChild(progressBarElem);
    if (item.status !== 'loading') {
      progressElem.classList.add('d-none');
    }
    return progressElem;
  }

  #createUploadingOverlayElem(item) {
    const uploadingOverlay = document.createElement('div');
    const spinnerElem = document.createElement('div');
    uploadingOverlay.classList.add('uploading-overlay');
    spinnerElem.classList.add(
      'spinner-border',
      'spinner-border-sm',
      'text-primary',
    );
    spinnerElem.role = 'status';
    uploadingOverlay.appendChild(spinnerElem);
    if (item.status !== 'loading') {
      uploadingOverlay.classList.add('d-none');
    }
    return uploadingOverlay;
  }

  #createPreviewItemImageElem(item) {
    const imgElem = document.createElement('img');
    imgElem.classList.add('img-preview');
    imgElem.src = item.data.path;
    return imgElem;
  }

  #createPreviewItemIconElem(item) {
    const iconElem = document.createElement('div');
    const imgElem = document.createElement('img');
    const textElem = document.createElement('span');
    let iconSrc = '/public/assets/icons/file.svg';
    let fileType = 'File';
    iconElem.classList.add('file-type-icon');
    if (item.status === 'failed') {
      iconSrc = '/public/assets/icons/x-lg.svg';
      fileType = 'Upload Failed';
      iconElem.classList.add('failed');
    } else if (item.data.mimetype.includes('pdf')) {
      iconSrc = '/public/assets/icons/pdf.svg';
      fileType = 'PDF';
    } else if (
      item.data.mimetype.includes('word') ||
      item.data.filename.endsWith('.doc') ||
      item.data.filename.endsWith('.docx')
    ) {
      iconSrc = '/public/assets/icons/doc.svg';
      fileType = 'DOC';
    } else if (
      item.data.mimetype.includes('excel') ||
      item.data.filename.endsWith('.xls') ||
      item.data.filename.endsWith('.xlsx')
    ) {
      iconSrc = '/public/assets/icons/xls.svg';
      fileType = 'XLS';
    } else if (item.data.mimetype.includes('video')) {
      iconSrc = '/public/assets/icons/video.svg';
      fileType = 'Video';
    } else if (item.data.mimetype.includes('audio')) {
      iconSrc = '/public/assets/icons/audio.svg';
      fileType = 'Audio';
    } else if (
      item.data.mimetype.includes('zip') ||
      item.data.mimetype.includes('archive') ||
      item.data.filename.endsWith('.zip') ||
      item.data.filename.endsWith('.rar')
    ) {
      iconSrc = '/public/assets/icons/archive.svg';
      fileType = 'Archive';
    } else if (item.data.mimetype.includes('text')) {
      iconSrc = '/public/assets/icons/text.svg';
      fileType = 'Text';
    }
    imgElem.src = iconSrc;
    imgElem.height = 20;
    imgElem.alt = fileType;
    textElem.innerText = fileType;
    iconElem.appendChild(imgElem);
    iconElem.appendChild(textElem);
    return iconElem;
  }

  #createPreviewItemContentElem(item) {
    return item.data.mimetype.startsWith('image') &&
      item.data.path &&
      item.status !== 'failed'
      ? this.#createPreviewItemImageElem(item)
      : this.#createPreviewItemIconElem(item);
  }

  #createRemoveItemElem(item) {
    const removeBtnElem = document.createElement('button');
    const imgElem = document.createElement('img');
    removeBtnElem.classList.add('remove-btn');
    removeBtnElem.type = 'button';
    imgElem.src = '/public/assets/icons/x.svg';
    imgElem.alt = 'close';
    imgElem.height = 20;
    removeBtnElem.appendChild(imgElem);
    removeBtnElem.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.#handleRemoveItem(item.data.id);
      },
      { signal: this.#abortController.signal },
    );
    if (item.status === 'loading') {
      removeBtnElem.classList.add('d-none');
    }
    return removeBtnElem;
  }

  #createPreviewItem(item) {
    const element = this.#createPreviewItemElem(item);
    const progressElem = element.querySelector('.file-progress');
    return { element, progressElem };
  }

  #createPreviewItemElem(item) {
    const previewItemElem = document.createElement('a');
    const fileInfoElem = document.createElement('div');
    previewItemElem.classList.add('preview-item');
    previewItemElem.href = item.data.path;
    previewItemElem.target = '_blank';
    previewItemElem.title = item.data.originalFilename;
    previewItemElem.dataset.fileId = item.data.id;
    if (item.status === 'failed') {
      previewItemElem.classList.add('failed');
    }
    fileInfoElem.classList.add('file-info');
    fileInfoElem.textContent = item.data.originalFilename;
    const uploadingOverlayElem = this.#createUploadingOverlayElem(item);
    const progressElem = this.#createProgressElem(item);
    const contentElem = this.#createPreviewItemContentElem(item);
    const removeItemElem = this.#createRemoveItemElem(item);
    previewItemElem.appendChild(contentElem);
    previewItemElem.appendChild(fileInfoElem);
    previewItemElem.appendChild(progressElem);
    previewItemElem.appendChild(uploadingOverlayElem);
    previewItemElem.appendChild(removeItemElem);
    return previewItemElem;
  }

  #handleFilesChange(files) {
    const event = new CustomEvent('files-change', { detail: files });
    this.dispatchEvent(event);
  }

  updateFiles(files = []) {
    this.#abortController.abort();
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.#abortController = new AbortController();
    this.appendChild(this.#createContainerElem());
    this.#previewContainerElem = this.querySelector('.preview-container');
    this.#fileInputElem = this.querySelector('input');
    files.forEach((file) => this.addFile(file));
  }

  connectedCallback() {
    this.updateFiles();
  }

  updateFile(fileId, file) {
    const previewItemElem = this.#items.get(fileId)?.element;
    if (previewItemElem) {
      const updatedItem = this.#createPreviewItem(file);
      previewItemElem.replaceWith(updatedItem.element);
      this.#items.delete(fileId);
      this.#items.set(file.data.id, updatedItem);
    }
  }

  updateFileProgress(fileId, file) {
    const progressElem = this.#items.get(fileId)?.progressElem;
    if (progressElem) {
      const updatedProgressElem = this.#createProgressElem(file);
      progressElem.replaceWith(updatedProgressElem);
      this.#items.get(fileId).progressElem = updatedProgressElem;
    }
  }

  removeFile(fileId) {
    const previewItemElem = this.#items.get(fileId)?.element;
    if (previewItemElem) {
      previewItemElem.remove();
      this.#items.delete(fileId);
    }
  }

  addFile(file) {
    const item = this.#createPreviewItem(file);
    this.#items.set(file.data.id, item);
    this.#previewContainerElem.insertBefore(
      item.element,
      this.#previewContainerElem.lastChild,
    );
  }

  static from(files = []) {
    const component = document.createElement(VNMUFileUploaderComponent.tagName);
    component.files = files;
    return component;
  }
}

export { VNMUFileUploaderComponent };
