import EasyMDE from 'easymde';

class VNMUEditorComponent extends HTMLElement {
  static tagName = 'vnmu-editor';
  static defaultConfig = {
    showIcons: ['table'],
    toolbarButtonClassPrefix: 'mde',
  };

  #editor = null;
  #textAreaElement = null;

  connectedCallback() {
    this.#textAreaElement = document.createElement('textarea');
    this.appendChild(this.#textAreaElement);
    this.#editor = new EasyMDE({
      ...VNMUEditorComponent.defaultConfig,
      element: this.textAreaElement,
    });
  }

  static from() {
    return document.createElement('vnmu-editor');
  }
}

export { VNMUEditorComponent };
