import fs from 'fs';

export const logToFile = (path: string) => {
  let buffer: string = '';
  let timeout: number;

  return (str: string) => {
    buffer += str + '\n';
    clearTimeout(timeout);
    setTimeout(() => {
      fs.writeFile(path, buffer, { flag: 'a' }, () => {});
      buffer = '';
    }, 500);
  };
};

export const removeFile = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

export const ensureDirectory = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
