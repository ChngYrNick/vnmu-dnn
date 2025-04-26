import EasyMDE from 'easymde';

class TextService {
  #endpoint = null;

  constructor(endpoint) {
    this.#endpoint = endpoint;
  }

  static endpoints = {
    pageId: {
      read: (id, language) => `/admin/content/text/${id}?lang=${language}`,
      update: (id, language) => `/admin/content/text/${id}?lang=${language}`,
    },
  };

  async read(id, language) {
    const response = await fetch(this.#endpoint.read(id, language));
    if (!response.ok) {
      return null;
    }
    const result = await response.json();
    return {
      data: result.data,
      updatedAt: new Date(result.updatedAt).getTime(),
    };
  }

  async update(id, language, data) {
    const response = await fetch(this.#endpoint.update(id, language), {
      method: 'PUT',
      body: data,
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return {
      data: result.data,
      updatedAt: new Date(result.updatedAt).getTime(),
    };
  }

  static from(key) {
    return new TextService(TextService.endpoints[key]);
  }
}

class VNMUEditorComponent extends HTMLElement {
  static tagName = 'vnmu-editor';
  static defaultConfig = {
    showIcons: ['table'],
    toolbarButtonClassPrefix: 'mde',
    spellChecker: false,
    nativeSpellcheck: false,
  };

  #editor = null;
  #textAreaElement = null;
  #saveBtnElement = null;
  #id = null;
  #idKey = null;
  #textService = null;
  #language = null;
  #editorStatusBarElem = null;
  #modifiedStatusElem = null;
  #upstreamStatusElem = null;
  #content = null;
  #autosavedContent = null;
  #abortController = new AbortController();
  #autosaveTimeoutId = null;
  #contentReset = false;

  connectedCallback() {
    this.#textAreaElement = document.createElement('textarea');
    this.appendChild(this.#createContainerElem());
    this.appendChild(this.#textAreaElement);
    this.#saveBtnElement = this.querySelector('.btn-save');
    this.#updateId();
    this.#updateLanguage();
    this.#textService = TextService.from(this.#idKey);
    const initialData = localStorage.getItem(this.autosavedContentId);
    this.#editor = new EasyMDE({
      ...VNMUEditorComponent.defaultConfig,
      element: this.#textAreaElement,
      initialValue: initialData ? JSON.parse(initialData).data : '',
    });
    this.#editorStatusBarElem = this.querySelector('.editor-statusbar');
    this.#updateStatusBarElem();
    this.#upstreamStatusElem =
      this.#editorStatusBarElem.querySelector('.upstream');
    this.#modifiedStatusElem =
      this.#editorStatusBarElem.querySelector('.modified');
    this.#loadAutosavedContent();
    this.#loadContent();
    this.#setupEvents();
  }

  #updateUpstreamStatusElem() {
    this.#upstreamStatusElem.classList.remove('d-none');

    if (
      this.#content &&
      this.#autosavedContent &&
      this.#content.updatedAt > this.#autosavedContent.createdAt
    ) {
      return;
    }

    this.#upstreamStatusElem.classList.add('d-none');
  }

  #updateModifiedStatusElem() {
    this.#modifiedStatusElem.classList.remove('text-warning', 'text-success');
    if (this.#autosavedContent) {
      this.#modifiedStatusElem.innerText = 'modified';
      this.#modifiedStatusElem.classList.add('text-warning');
      return;
    }
    this.#modifiedStatusElem.innerText = 'up-to-date';
    this.#modifiedStatusElem.classList.add('text-success');
  }

  #loadAutosavedContent() {
    const item = localStorage.getItem(this.autosavedContentId);
    this.#autosavedContent = item ? JSON.parse(item) : null;
    this.#handleAutosavedContentLoad();
  }

  #handleAutosavedContentLoad() {
    if (this.#autosavedContent) {
      this.#editor.value(this.#autosaveContent.data);
    }
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  #createModifiedStatusElem() {
    const modifiedStatusElem = document.createElement('span');
    modifiedStatusElem.classList.add('modified');
    return modifiedStatusElem;
  }

  #createUpstreamStatusElem() {
    const modifiedStatusElem = document.createElement('span');
    modifiedStatusElem.classList.add('upstream', 'text-warning', 'd-none');
    modifiedStatusElem.innerText = 'upstream updated';
    return modifiedStatusElem;
  }

  #updateStatusBarElem() {
    this.#editorStatusBarElem.insertBefore(
      this.#createModifiedStatusElem(),
      this.#editorStatusBarElem.firstChild,
    );
    this.#editorStatusBarElem.insertBefore(
      this.#createUpstreamStatusElem(),
      this.#editorStatusBarElem.firstChild,
    );
    const autosaveElem = this.#editorStatusBarElem.querySelector('.autosave');
    autosaveElem.classList.add('d-none');
  }

  #handleEditorChange() {
    if (this.#autosaveTimeoutId) {
      clearTimeout(this.#autosaveTimeoutId);
    }
    if (this.#contentReset) {
      this.#contentReset = false;
      return;
    }

    this.#autosaveTimeoutId = setTimeout(() => {
      {
        this.#autosaveTimeoutId = null;
        this.#autosaveContent();
      }
    }, 1000);
  }

  #setupEvents() {
    this.#editor.codemirror.on('change', () => {
      const event = new CustomEvent('editor-change');
      this.dispatchEvent(event);
    });

    this.addEventListener('editor-change', () => this.#handleEditorChange(), {
      signal: this.#abortController.signal,
    });
  }

  #autosaveContent() {
    const item = localStorage.getItem(this.autosavedContentId);
    const createdAt = item ? JSON.parse(item).createdAt : new Date().getTime();
    this.#autosavedContent = {
      data: this.#editor.value(),
      updatedAt: new Date().getTime(),
      createdAt,
    };
    localStorage.setItem(
      this.autosavedContentId,
      JSON.stringify(this.#autosavedContent),
    );
    this.#handleContentAutosave();
  }

  #handleContentAutosave() {
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  disconnectedCallback() {
    this.#editor = null;
    const event = new CustomEvent('destroy');
    this.dispatchEvent(event);
    this.#abortController.abort();
  }

  async #loadContent() {
    this.#content = await this.#textService.read(this.#id, this.#language);
    this.#handleContentLoad();
  }

  get autosavedContentId() {
    return `editor_${this.#idKey}-${this.#id}_lang-${this.#language}`;
  }

  #handleContentLoad() {
    if (!this.#autosavedContent && this.#content) {
      this.#editor.value(this.#content.data);
    }
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  #updateId() {
    if (this.getAttribute('page-id')) {
      this.#id = this.getAttribute('page-id');
      this.#idKey = 'pageId';
    }
  }

  #updateLanguage() {
    if (this.getAttribute('lang')) {
      this.#language = this.getAttribute('lang');
    }
  }

  async #saveContent() {
    const data = this.#editor.value();
    const content = this.#textService.update(this.#id, this.#language, data);
    if (content) {
      this.#content = content;
      this.#handleSavedContent();
      return;
    }
    this.#handleContentSaveFail();
  }

  #handleContentReset() {
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  #handleSavedContent() {
    this.#resetContent();
    this.#updateSaveButtonElem('settled');
  }

  #handleContentSaveFail() {
    this.#updateSaveButtonElem('settled');
  }

  #resetContent() {
    this.#contentReset = true;
    this.#autosavedContent = null;
    localStorage.removeItem(this.autosavedContentId);
    this.#editor.value(this.#content?.data || '');
    this.#handleContentReset();
  }

  #handleSaveButtonClick() {
    this.#updateSaveButtonElem('loading');
    this.#saveContent();
  }

  #updateSaveButtonElem(status) {
    this.#saveBtnElement.firstChild.classList.remove('d-none');
    if (status === 'settled') {
      this.#saveBtnElement.firstChild.classList.add('d-none');
    }
  }

  #createSaveButtonElem() {
    const saveButtonElem = document.createElement('button');
    const spinnerElem = document.createElement('span');
    const textElem = document.createElement('span');
    saveButtonElem.classList.add(
      'btn',
      'btn-sm',
      'btn-outline-success',
      'btn-save',
    );
    saveButtonElem.addEventListener(
      'click',
      () => this.#handleSaveButtonClick(),
      {
        signal: this.#abortController.signal,
      },
    );
    spinnerElem.classList.add(
      'spinner-border',
      'spinner-border-sm',
      'me-2',
      'd-none',
    );
    textElem.innerText = 'Save';
    saveButtonElem.appendChild(spinnerElem);
    saveButtonElem.appendChild(textElem);
    return saveButtonElem;
  }

  #createResetButtonElem() {
    const resetButtonElem = document.createElement('button');
    resetButtonElem.classList.add(
      'btn',
      'btn-sm',
      'btn-outline-warning',
      'mx-2',
    );
    resetButtonElem.innerText = 'Reset';
    resetButtonElem.addEventListener('click', () => this.#resetContent(), {
      signal: this.#abortController.signal,
    });
    return resetButtonElem;
  }

  #createContainerElem() {
    const containerElem = document.createElement('div');
    containerElem.classList.add(
      'container-fluid',
      'p-0',
      'mb-2',
      'd-flex',
      'flex-row-reverse',
    );
    containerElem.appendChild(this.#createSaveButtonElem());
    containerElem.appendChild(this.#createResetButtonElem());
    return containerElem;
  }

  static from() {
    return document.createElement('vnmu-editor');
  }
}

export { VNMUEditorComponent };
