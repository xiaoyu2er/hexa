const pkg = require('../package.json');
const fs = require('node:fs');
const path = require('node:path');
const uiFiles = fs.readdirSync(path.resolve(__dirname, '../src/ui'));

const uiExports = uiFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, '');
  acc[`./${name}`] = `./src/ui/${file}`;
  return acc;
}, {});

const otherFiles = fs
  .readdirSync(path.resolve(__dirname, '../src'))
  .filter(
    (file) =>
      file.endsWith('.tsx') &&
      !file.endsWith('stories.tsx') &&
      !file.endsWith('demo.tsx') &&
      file !== 'index.tsx'
  );

const otherExports = otherFiles.reduce((acc, file) => {
  const name = file.replace(/\.tsx$/, '');
  acc[`./${name}`] = `./src/${file}`;
  return acc;
}, {});

pkg.exports = {
  './globals.css': './src/globals.css',
  './hooks/*': './src/hooks/*.tsx',
  './icons': './src/icons/index.tsx',
  './font': './src/font/font.tsx',
  ...uiExports,
  ...otherExports,
  '.': './src/index.tsx',
};

// udpate package.json
fs.writeFileSync(
  path.resolve(__dirname, '../package.json'),
  `${JSON.stringify(pkg, null, 2)}\n`
);
