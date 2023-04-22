
class FileError extends Error {
  constructor() {
    super();
    this.name = 'FileError';
  }
}

export class FileNotFound extends FileError {
  constructor(filePath?: string) {
    super();
    if (filePath) {
      this.message = `File ${filePath} does not exist.`;
    } else {
      this.message = 'We could not find any Otto file.';
    }
  }
}

export class URLNotFound extends FileError {
  constructor(URL: string) {
    super();
    this.message = `Unable to fetch file from url: ${URL}`;
  }
}

type From = 'file' | 'url' | 'context'

export class ErrorLoadingOtto extends Error {
  private readonly errorMessages = { };
  constructor(from?: From, param?: string) {
    super();
    if (from === 'file') {
      this.name = 'error loading Otto document from file';
      this.message = `${param} file does not exist.`;
    }
    if (from === 'url') {
      this.name = 'error loading Otto document from url';
      this.message = `Failed to download ${param}.`;
    }
    if (from === 'context') {
      this.name = 'error loading Otto document from context';
      this.message = `${param} context name does not exist.`;
    }

    if (!from) {
      this.name = 'error locating Otto document';
      this.message = 'No further error message...';
    }
  }
}
