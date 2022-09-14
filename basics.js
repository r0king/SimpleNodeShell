const fs = require('fs');
const path = require("path");

let currentDir = '.';

const readFiles = (dirname) => {
  try {
    const directoryName = path.basename(__dirname);
    if (directoryName === currentDir) {
      currentDir = '.'
    }

    const filenames = fs.readdirSync(`${currentDir}/${dirname}`);
    filenames.forEach((filename) => {
      console.log(filename)
    });
  }
  catch (err) {
    console.log(err);
    return;
  }
};

const ls = (dir) => {
  if (dir === undefined) {
    dir = '.'
  }
  readFiles(dir);
};
exports.ls = ls;

const cd = (dir) => {
  if (fs.existsSync(`${currentDir}/${dir}`)) {
    currentDir = path.resolve(`${currentDir}/${dir}`);
    console.log('Directory updated!');
  } else {
    console.log('Directory not found.');
  }

};

exports.cd = cd;

const pwd = () => {
  if (currentDir === '.') {
    currentDir = __dirname;
  }
  console.log(currentDir);
  return currentDir
};

exports.pwd = pwd;
