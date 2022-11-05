const fs = require('node:fs/promises'),
  path = require('node:path'),
  directory = path.join(__dirname, 'secret-folder')

const files = fs.readdir(directory, { withFileTypes: true });

files.then((data) => {
  let result = [];
  data.forEach(dirent => {
    if (dirent.isFile()) {
      result.push((`${path.basename(dirent.name, path.extname(dirent.name))} - ${path.extname(dirent.name).slice(1)} - `));
    }
  });
  return [data, result];
}).then(arr => {
  let statsArr = [];
  for (let i = 0; i < arr[0].length; i++) {
    let dirent = arr[0][i];
    statPromise = fs.stat(`${path.join(directory, path.basename(dirent.name))}`).then(stats => {
      if (dirent.isFile()) {
        statsArr.push(stats.size)
      }
      return statsArr;
    });
  }

  statPromise.then((stats) => {
    stats.forEach((stat, i) => {
      let result = arr[1][i] + stat + ' byte';
      console.log(result);
    })
  });
})
