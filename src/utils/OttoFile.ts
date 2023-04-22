import { promises as fs } from 'fs';
import { URL } from 'url';
import fetch from 'node-fetch';
import { ErrorLoadingOtto } from '../errors/FileErrors';
import { MissingContextFileError } from 'errors/ContextError';
import { loadContext } from './Context';

const { readFile, lstat } = fs;

const TYPE_CONTEXT_NAME = 'context-name';
const TYPE_FILE_PATH = 'file-path';
const TYPE_URL = 'url-path';

export class OttoFile {
  private readonly file: string;
  private readonly filePath?: string;
  private readonly fileURL?: string;
  private readonly kind?: 'file' | 'url';

  constructor(file: string, options: { filepath?: string, fileURL?: string } = {}) {
    this.file = file;
    if (options.filepath) {
      this.filePath = options.filepath;
      this.kind = 'file';
    } else if (options.fileURL) {
      this.fileURL = options.fileURL;
      this.kind = 'url';
    }
  }

  text() {
    return this.file;
  }

  getFilePath() {
    return this.filePath;
  }

  getFileURL() {
    return this.fileURL;
  }

  getKind() {
    return this.kind;
  }

  getSource() {
    return this.getFilePath() || this.getFileURL();
  }

  toSourceString() {
    if (this.kind === 'file') {
      return `File ${this.filePath}`;
    }
    return `URL ${this.fileURL}`;
  }

  static async fromFile(filepath: string) {
    let file;
    try {
      file = await readFile(filepath, { encoding: 'utf8' });
    } catch (error) {
      throw new ErrorLoadingOtto('file', filepath);
    }
    return new OttoFile(file, { filepath });
  }

  static async fromURL(URLpath: string) {
    let response;
    try {
      response = await fetch(URLpath, { method: 'GET' });
      if (!response.ok) {
        throw new ErrorLoadingOtto('url', URLpath);
      }
    } catch (error) {
      throw new ErrorLoadingOtto('url', URLpath);
    }
    return new OttoFile(await response?.text() as string, { fileURL: URLpath });
  }
}

export default class OttoFilePath {
  private readonly pathToFile: string;

  constructor(filePath: string) {
    this.pathToFile = filePath;
  }

  getPath(): string {
    return this.pathToFile;
  }

  async read(): Promise<string> {
    return readFile(this.pathToFile, { encoding: 'utf8' });
  }
}

interface LoadType {
  file?: boolean
  url?: boolean
  context?: boolean
}

export async function load(filePathOrContextName?: string, loadType?: LoadType): Promise<OttoFile> {
  if (filePathOrContextName) {
    if (loadType?.file) { return OttoFile.fromFile(filePathOrContextName); }
    if (loadType?.context) { return loadFromContext(filePathOrContextName); }
    if (loadType?.url) { return OttoFile.fromURL(filePathOrContextName); }

    const type = await nameType(filePathOrContextName);
    if (type === TYPE_CONTEXT_NAME) {
      return loadFromContext(filePathOrContextName);
    }

    if (type === TYPE_URL) {
      return OttoFile.fromURL(filePathOrContextName);
    }
    await fileExists(filePathOrContextName);
    return OttoFile.fromFile(filePathOrContextName);
  }

  try {
    return await loadFromContext();
  } catch (e) {
    const autoDetectedOttoFile = await detectOttoFile();
    if (autoDetectedOttoFile) {
      return OttoFile.fromFile(autoDetectedOttoFile);
    }

    if (e instanceof MissingContextFileError) {
      throw new ErrorLoadingOtto();
    }

    throw e;
  }
}

export async function nameType(name: string): Promise<string> {
  if (name.startsWith('.')) {
    return TYPE_FILE_PATH;
  }

  try {
    if (await fileExists(name)) {
      return TYPE_FILE_PATH;
    }
    return TYPE_CONTEXT_NAME;
  } catch (e) {
    if (await isURL(name)) { return TYPE_URL; }
    return TYPE_CONTEXT_NAME;
  }
}

export async function isURL(urlpath: string): Promise<boolean> {
  try {
    const url = new URL(urlpath);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

export async function fileExists(name: string): Promise<boolean> {
  try {
    if ((await lstat(name)).isFile()) {
      return true;
    }
    throw new ErrorLoadingOtto('file', name);
  } catch (e) {
    throw new ErrorLoadingOtto('file', name);
  }
}

async function loadFromContext(contextName?: string): Promise<OttoFile> {
  try {
    const context = await loadContext(contextName);
    return OttoFile.fromFile(context);
  } catch (error) {
    if (error instanceof MissingContextFileError) {throw new ErrorLoadingOtto();}
    throw error;
  }
}

async function detectOttoFile(): Promise<string | undefined> {
  //TODO
  return undefined;
}

