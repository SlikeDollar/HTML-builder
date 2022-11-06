const fs = require('fs/promises');
const path = require('node:path'),
  { createWriteStream } = require('fs');

const testPath = path.join(__dirname, 'project-dist'),
  stylesDir = path.join(__dirname, 'styles'),
  writeStream = createWriteStream(path.join(testPath, 'bundle.css'));

let stylesArr = [];
async function bundleCss(stylesPath = stylesDir) {
  async function readFileText(file) {
    return await fs.readFile(path.join(stylesPath, file), 'utf-8');
  }

  fs.readdir(stylesPath, { withFileTypes: true }).then(async files => {
    for (let dirent of files) {
      if (dirent.isFile() && path.extname(dirent.name) === '.css') {
        let file = readFileText(dirent.name);
        await file.then(data => {
          stylesArr.push(data);
        });
      }
    }
    return stylesArr;
  })
    .then(data => {
      writeStream.write(data.join(""));
    });
}

bundleCss();
