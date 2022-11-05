const fs = require('fs/promises');
const path = require('node:path');

const srcDir = path.join(__dirname, 'files'),
  destDir = path.join(__dirname, 'files-copy');

async function copyDir(srcPath = srcDir, destPath = destDir) {
  async function cp(file) {
    await fs.copyFile(path.join(srcPath, file), path.join(destDir, file));
  }

  await fs.rm(destPath, { recursive: true, force: true });
  await fs.mkdir(destPath);

  fs.readdir(srcPath, { withFileTypes: true }).then(files => {
    files.forEach(dirent => {
      cp(dirent.name)
    });
  });
}


copyDir();
