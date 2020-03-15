const CPUs = require('os').cpus().length;
const { fork } = require('child_process');
const pdfjsLib = require('pdfjs-dist');

const { convertToArray, splitPages } = require('./utilities');

const source = `${process.cwd()}/source/tfile.pdf`;

const density = 72;
const format = 'jpeg';
const size = '600x834';

pdfjsLib.getDocument(source).then(async ({ numPages: totalPages = null }) => {
  try {
    const pages = convertToArray(totalPages);
    const threads = convertToArray(CPUs);
    const workload = splitPages(pages, threads);
  
    for (let i = 0; i < workload.length; i += 1) {
      const converter = fork('converter.js');
      converter.send({
        options: {
          density,
          format,
          size,
        },
        pages: [...workload[i]],
        source,
        worker: i,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
}).catch((error) => {
  throw new Error(error);
});
