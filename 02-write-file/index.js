const { stdout, stdin } = process;
const fs = require('fs');
const path = require('node:path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'))

stdout.write('Привет, впиши данные и посмотри, что будет)');

stdin.on('data', data => {
  data = data.toString();
  if (data.trim() == 'exit') {
    exitProgram();
  }

  writeStream.write(data);
});

process.on('SIGINT', exitProgram);

function exitProgram() {
  stdout.write('\n Bye( \n')
  process.exit();
}
