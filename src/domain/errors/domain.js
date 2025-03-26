class DomainError extends Error {
  constructor(type, message, options) {
    super(message, options);
    this.type = type;
  }
}

export { DomainError };
