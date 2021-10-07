const CPUs = require('os').cpus().length;
const { fork } = require('child_process');
// eslint-disable-next-line
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { mkdir, readFile } = require('fs/promises');

const { checkAccessibility, convertToArray, splitPages } = require('./utilities');

const density = 300;
const format = 'png';
const size = '1240x1754'; // A4 / 2, full A4 is 2480x3508

async function launch() {
  const [path = ''] = process.argv.slice(2);
  if (!path) {
    throw new Error('Missing path to the file!');
  }

  await checkAccessibility(path);

  const [saveDirName] = path.split('/').slice(-1)[0].split('.');
  const partials = path.split('/');
  const savePath = `${partials.slice(0, partials.length - 1).join('/')}/${saveDirName}`;

  const file = await readFile(path);
  const { numPages: totalPages = null } = await pdfjsLib.getDocument(file).promise;
  if (!totalPages) {
    throw new Error('Cannot process provided file!');
  }

  await mkdir(savePath);

  const [width, height] = size.split('x');

  const pages = convertToArray(totalPages);
  const threads = convertToArray(CPUs);
  const workload = splitPages(pages, threads);

  for (let i = 0; i < workload.length; i += 1) {
    const converter = fork('converter.js');
    converter.send({
      options: {
        density,
        format,
        height: Number(height),
        savePath,
        width: Number(width),
      },
      pages: [...workload[i]],
      source: path,
      worker: i,
    });
  }
}

launch();
