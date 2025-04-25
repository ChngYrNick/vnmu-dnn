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
    return response.ok ? response.json() : null;
  }

  async update(id, language, data) {
    return await fetch(this.#endpoint.update(id, language), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
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
  #id = null;
  #idKey = null;
  #textService = null;
  #language = null;
  #autosavedElem = null;

  connectedCallback() {
    this.#textAreaElement = document.createElement('textarea');
    this.appendChild(this.#textAreaElement);
    this.#updateId();
    this.#updateLanguage();
    this.#textService = TextService.from(this.#idKey);
    this.#editor = new EasyMDE({
      ...VNMUEditorComponent.defaultConfig,
      element: this.#textAreaElement,
      autosave: {
        enabled: true,
        uniqueId: `${this.#idKey}-${this.#id}`,
        delay: 1000,
        text: 'Modified: ',
      },
    });
    this.#autosavedElem = this.querySelector('#autosaved');
    this.#loadContent();
  }

  async #loadContent() {
    const content = await this.#textService.read(this.#id, this.#language);
    const autosavedContent = localStorage.getItem(`smde_${this.#idKey}-${this.#id}`);
    if (content && !autosavedContent) {
      this.#editor.value(content);
    }
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

  static from() {
    return document.createElement('vnmu-editor');
  }
}

export { VNMUEditorComponent };
