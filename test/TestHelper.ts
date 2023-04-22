import { existsSync, writeFileSync, unlinkSync } from 'fs';
import * as path from 'path';
import { IContextFile, DEFAULT_CONTEXT_FILE_PATH } from '../src/utils/Context';
import OttoFile from '../src/utils/OttoFile';

const OTTO_FILE_PATH = path.resolve(process.cwd(), 'otto.json');

export default class ContextTestingHelper {
  private _context: IContextFile;
  constructor() {
    const homeOttoFile = new OttoFile(path.resolve(__dirname, 'otto.yml'));

    const codeOttoFile = new OttoFile(path.resolve(__dirname, 'otto.yml'));
    this._context = {
      current: 'home',
      store: {
        home: homeOttoFile.getPath(),
        code: codeOttoFile.getPath()
      }
    };
  }

  get context(): IContextFile {
    return this._context;
  }

  createDummyContextFile(): void {
    writeFileSync(DEFAULT_CONTEXT_FILE_PATH, JSON.stringify(this._context), { encoding: 'utf-8' });
  }

  deleteDummyContextFile(): void {
    unlinkSync(DEFAULT_CONTEXT_FILE_PATH);
  }

  unsetCurrentContext(): void {
    delete this._context.current;
  }

  setCurrentContext(context: string): void {
    this._context.current = context;
  }

  getPath(key: string): string | undefined {
    return this._context.store[String(key)];
  }

  createOttoFileAtWorkingDir(): void {
    if (!existsSync(OTTO_FILE_PATH)) {
      writeFileSync(OTTO_FILE_PATH, '');
    }
  }

  deleteOttoFileAtWorkingDir(): void {
    if (existsSync(OTTO_FILE_PATH)) {
      unlinkSync(OTTO_FILE_PATH);
    }
  }
  newCommandHelper() {
    return {
      deleteOttoFile: () => {
        const specficicationFilePath = path.resolve(process.cwd(), 'otto.yaml');
        if (existsSync(specficicationFilePath)) {
          unlinkSync(specficicationFilePath);
        }
      }
    };
  }
}

export function fileCleanup(filepath: string) {
  unlinkSync(filepath);
}
