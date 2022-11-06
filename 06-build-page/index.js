const fs = require('fs/promises');
const path = require('node:path'),
  { createWriteStream } = require('fs');

let destDir = path.join(__dirname, 'project-dist'),
  srcAssetsDir = path.join(__dirname, 'assets'),
  destAssetsDir = path.join(destDir, 'assets'),
  stylesArr = [];

async function bundleCss(stylesPath) {
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
      createWriteStream(path.join(destDir, 'style.css')).write(data.join(""));
    });
}

async function copyDir(srcPath, destPath) {
  async function cp(file) {
    await fs.copyFile(path.join(srcPath, file), path.join(destPath, file));
  }

  await fs.rm(destPath, { recursive: true, force: true });
  await fs.mkdir(destPath);

  fs.readdir(srcPath, { withFileTypes: true }).then(files => {
    files.forEach(dirent => {
      if (dirent.isDirectory()) {
        copyDir(path.join(srcAssetsDir, dirent.name), path.join(destAssetsDir, dirent.name));
      } else {
        cp(dirent.name)
      }
    });
  });
}

async function buildHtml() {
  async function readFile(path) {
    return await fs.readFile(path, 'utf-8');
  }

  let template = await readFile(path.join(__dirname, 'template.html'));
  let components = await fs.readdir(path.join(__dirname, 'components'), { withFileTypes: true });

  let regex = /{{[a-z]*}}/gm;
  let matchedComponents = template.match(regex);

  for (let i = 0; i < matchedComponents.length; i++) {
    let comp = matchedComponents[i].replace(/[{}]/g, '')
    for (const dirent of components) {
      if (comp === path.basename(dirent.name, path.extname(dirent.name))) {
        let componentInner = await readFile(path.join(__dirname, 'components', dirent.name));
        template = template.replace(/{{[a-z]*}}/m, componentInner);
      }
    }
  }

  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  let writeHtmlStream = createWriteStream(path.join(destDir, 'index.html'));
  writeHtmlStream.write(template);

  bundleCss(path.join(__dirname, 'styles'));
  copyDir(path.join(__dirname, 'assets'), path.join(destDir, 'assets'));
}

buildHtml();

