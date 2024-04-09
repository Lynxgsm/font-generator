import { stat } from 'fs';

export const isFolder = (path: string) => {
  return new Promise((resolve, reject) => {
    stat(path, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats.isDirectory());
    });
  });
};
