import {
  existsSync,
  readdirSync,
  copyFileSync,
  mkdirSync,
  writeFileSync,
} from 'fs';
import { isFolder } from './utils/isFolder';
import { getFileExtension } from './utils/getSVG';
import { PATHS } from './utils/paths';
import { sys } from 'typescript';

const reset = () => {
  if (!existsSync(PATHS.OUTPUT)) {
    mkdirSync(PATHS.OUTPUT);
  }
};

const readFolder = async (path: string) => {
  let icons: string[] = [];
  // CHECK IF DIR EXISTS
  if (existsSync(path)) {
    const files = readdirSync(path);
    for (let file of files) {
      // RECURSIVE CHECK IF FOLDER
      if (await isFolder(`${path}/${file}`)) {
        readFolder(`${path}/${file}`);
      }

      // IF SVG THEN RENAME AND COPY
      if (getFileExtension(file) === '.svg') {
        const filename = file.toLowerCase().replaceAll(' ', '_');
        // CUSTOM NAME CHANGES (only in this case)
        copyFileSync(`${path}/${file}`, `${PATHS.OUTPUT}/${filename}`);
        icons.push(filename.replace('.svg', ''));
      }
    }
  }

  const iconsStr = `export const icons = [${icons
    .map((i) => `"${i}"`)
    .join(', ')}]`;
  const necIconsPath = `${PATHS.ICONS}/nec-icons.ts`;
  writeFileSync(necIconsPath, iconsStr);
};

reset();
readFolder(sys.args[0]);
