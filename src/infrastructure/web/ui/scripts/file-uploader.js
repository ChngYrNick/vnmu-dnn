class VNMUFileUploaderComponent extends HTMLElement {
  static tagName = 'vnmu-file-uploader';

  #abortController = new AbortController();
  files = [];
  #fileInputElem = null;

  #handleRemoveItem(index) {
    const event = new CustomEvent('delete-file', { detail: index });
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
    const img = document.createElement('img');
    img.classList.add('img-preview');
    if (item.status !== 'complete') {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(item.data);
    } else {
      img.src = item.data.path;
    }
    return img;
  }

  #createPreviewItemIconElem(item) {
    const iconElem = document.createElement('div');
    const imgElem = document.createElement('img');
    const textElem = document.createElement('span');
    iconElem.classList.add('file-type-icon');
    let iconSrc = '/public/assets/icons/file.svg';
    let fileType = 'File';
    if (item.data.type.includes('pdf')) {
      iconSrc = '/public/assets/icons/pdf.svg';
      fileType = 'PDF';
    } else if (
      item.data.type.includes('word') ||
      item.data.name.endsWith('.doc') ||
      item.data.name.endsWith('.docx')
    ) {
      iconSrc = '/public/assets/icons/doc.svg';
      fileType = 'DOC';
    } else if (
      item.data.type.includes('excel') ||
      item.data.name.endsWith('.xls') ||
      item.data.name.endsWith('.xlsx')
    ) {
      iconSrc = '/public/assets/icons/xls.svg';
      fileType = 'XLS';
    } else if (item.data.type.includes('video')) {
      iconSrc = '/public/assets/icons/video.svg';
      fileType = 'Video';
    } else if (item.data.type.includes('audio')) {
      iconSrc = '/public/assets/icons/audio.svg';
      fileType = 'Audio';
    } else if (
      item.data.type.includes('zip') ||
      item.data.type.includes('archive') ||
      item.data.name.endsWith('.zip') ||
      item.data.name.endsWith('.rar')
    ) {
      iconSrc = '/public/assets/icons/archive.svg';
      fileType = 'Archive';
    } else if (item.data.type.includes('text')) {
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
    return item.data.type.startsWith('image')
      ? this.#createPreviewItemImageElem(item)
      : this.#createPreviewItemIconElem(item);
  }

  #createRemoveItemElem(item, index) {
    const removeBtnElem = document.createElement('div');
    const imgElem = document.createElement('img');
    removeBtnElem.classList.add('remove-btn');
    removeBtnElem.dataset.itemIndex = index;
    imgElem.src = '/public/assets/icons/x.svg';
    imgElem.alt = 'close';
    imgElem.height = 20;
    removeBtnElem.appendChild(imgElem);
    removeBtnElem.addEventListener(
      'click',
      () => this.#handleRemoveItem(index),
      { signal: this.#abortController.signal },
    );
    if (item.status === 'loading') {
      removeBtnElem.classList.add('d-none');
    }
    return removeBtnElem;
  }

  #createPreviewItemElem(item, index) {
    const previewItemElem = document.createElement('div');
    const fileInfoElem = document.createElement('div');
    previewItemElem.classList.add('preview-item');
    previewItemElem.dataset.index = index;
    fileInfoElem.classList.add('file-info');
    fileInfoElem.textContent = item.data.name;
    const uploadingOverlayElem = this.#createUploadingOverlayElem(item);
    const progressElem = this.#createProgressElem(item);
    const contentElem = this.#createPreviewItemContentElem(item);
    const removeItemElem = this.#createRemoveItemElem(item, index);
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

  render() {
    this.#abortController.abort();
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.#abortController = new AbortController();
    this.files.forEach((item, index) => {
      this.appendChild(this.#createPreviewItemElem(item, index));
    });
    this.appendChild(this.#createContainerElem());
    this.#fileInputElem = this.querySelector('input');
  }

  connectedCallback() {
    this.render();
  }

  static from() {
    return document.createElement(VNMUFileUploaderComponent.tagName);
  }
}

export { VNMUFileUploaderComponent };
