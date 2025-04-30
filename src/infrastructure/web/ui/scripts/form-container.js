class VNMUFormContainerComponent extends HTMLElement {
  static tagName = 'vnmu-form-container';

  #abortController = new AbortController();

  #passwordElem = null;
  #repeatPasswordElem = null;

  connectedCallback() {
    this.#passwordElem = this.querySelector('#password');
    this.#repeatPasswordElem = this.querySelector('#repeatPassword');
    this.#setupEvents();
  }

  #setupEvents() {
    this.#passwordElem.addEventListener(
      'input',
      () => this.#validateRepeatPassword(),
      { signal: this.#abortController.signal },
    );
    this.#repeatPasswordElem.addEventListener(
      'input',
      () => this.#validateRepeatPassword(),
      { signal: this.#abortController.signal },
    );
  }

  disconnectedCallback() {
    this.#abortController.abort();
  }

  #validateRepeatPassword() {
    const password = this.#passwordElem.value;
    const confirmPassword = this.#repeatPasswordElem.value;

    if (password !== confirmPassword) {
      this.#repeatPasswordElem.setCustomValidity('Passwords do not match');
    } else {
      this.#repeatPasswordElem.setCustomValidity('');
    }
  }

  static from() {
    return document.createElement(VNMUFormContainerComponent.tagName);
  }
}

export { VNMUFormContainerComponent };
