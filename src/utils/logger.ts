import { constants } from './constants';
import { ensureDirectory, logToFile, removeFile } from './fs-utils';

class Logger {
  public log: (str: string) => void;

  constructor({ type, filePath }: { type: 'file' | 'console'; filePath?: string }) {
    if (type === 'file') {
      ensureDirectory('logs');
      removeFile(filePath!);
      this.log = logToFile(filePath!);
    } else {
      this.log = console.log;
    }
  }
}

export const logger = new Logger({ type: 'file', filePath: constants.logFilePath });
// export const logger = new Logger({ type: 'console' });
