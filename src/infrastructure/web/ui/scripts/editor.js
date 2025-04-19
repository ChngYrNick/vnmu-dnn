import EasyMDE from 'easymde';

class VNMUEditorComponent extends HTMLElement {
  static tagName = 'vnmu-editor';

  editor = null;
  textAreaElement = null;

  connectedCallback() {
    this.textAreaElement = document.createElement('textarea');
    this.appendChild(this.textAreaElement);
    this.editor = new EasyMDE({ element: this.textAreaElement });
  }

  static from() {
    return document.createElement('vnmu-editor');
  }
}

export { VNMUEditorComponent };
