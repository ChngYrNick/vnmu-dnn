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
    materialId: {
      read: (id, language) => `/admin/material/text/${id}?lang=${language}`,
      update: (id, language) => `/admin/material/text/${id}?lang=${language}`,
    },
    staffId: {
      read: (id, language) => `/admin/staff/text/${id}?lang=${language}`,
      update: (id, language) => `/admin/staff/text/${id}?lang=${language}`,
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
  #editor = null;
  #textAreaElement = null;
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
  #contentLoad = false;

  connectedCallback() {
    this.#textAreaElement = document.createElement('textarea');
    this.appendChild(this.#createContainerElem());
    this.appendChild(this.#textAreaElement);
    this.#updateId();
    this.#updateLanguage();
    this.#textService = TextService.from(this.#idKey);
    const initialData = localStorage.getItem(this.autosavedContentId);
    this.#editor = new EasyMDE({
      ...this.#createEditorDefaultConfig(),
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

  #createEditorDefaultConfig() {
    return {
      showIcons: ['table'],
      toolbarButtonClassPrefix: 'mde',
      spellChecker: false,
      nativeSpellcheck: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'table',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
        '|',
        {
          name: 'reset',
          action: () => this.#resetContent(),
          className: 'fa fa-rotate-left',
          title: 'Reset',
        },
        {
          name: 'save',
          action: () => this.#saveContent(),
          className: 'fa fa-check',
          title: 'Save',
        },
      ],
    };
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
    if (this.#autosavedContent) {
      this.#modifiedStatusElem.innerText = 'modified';
      return;
    }
    this.#modifiedStatusElem.innerText = 'up-to-date';
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
    if (this.#contentLoad) {
      this.#contentLoad = false;
      return;
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
    if (this.#autosaveTimeoutId) {
      clearTimeout(this.#autosaveTimeoutId);
    }
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
      this.#contentLoad = true;
      this.#editor.value(this.#content.data);
    }
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  #updateId() {
    if (this.getAttribute('page-id')) {
      this.#id = this.getAttribute('page-id');
      this.#idKey = 'pageId';
    } else if (this.getAttribute('material-id')) {
      this.#id = this.getAttribute('material-id');
      this.#idKey = 'materialId';
    } else if (this.getAttribute('staff-id')) {
      this.#id = this.getAttribute('staff-id');
      this.#idKey = 'staffId';
    }
  }

  #updateLanguage() {
    if (this.getAttribute('lang')) {
      this.#language = this.getAttribute('lang');
    }
  }

  async #saveContent() {
    const data = this.#editor.value();
    const content = await this.#textService.update(
      this.#id,
      this.#language,
      data,
    );
    if (content) {
      this.#content = content;
      this.#handleSavedContent();
      return;
    }
  }

  #handleContentReset() {
    this.#updateUpstreamStatusElem();
    this.#updateModifiedStatusElem();
  }

  #handleSavedContent() {
    this.#resetContent();
  }

  #resetContent() {
    this.#contentReset = true;
    this.#autosavedContent = null;
    localStorage.removeItem(this.autosavedContentId);
    this.#editor.value(this.#content?.data || '');
    this.#handleContentReset();
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
    return containerElem;
  }

  static from() {
    return document.createElement('vnmu-editor');
  }
}

export { VNMUEditorComponent };
