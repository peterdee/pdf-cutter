const cluster = require('cluster');
const CPUs = require('os').cpus().length;
const PDF2Pic = require("pdf2pic");
const pdfjsLib = require('pdfjs-dist');

const { convertToArray, splitPages } = require('./utilities');

const sourcePath = `${process.cwd()}/source/file.pdf`;

const density = 72;
const format = 'jpeg';
const size = '600x834';

const converter = new PDF2Pic({
  density,
  format,
  savedir: `${process.cwd()}/result`,
  savename: 'page',
  size,
});

const totalPages = convertToArray(357);
const threads = convertToArray(CPUs);
const workload = splitPages(totalPages, threads);

console.log('workload', workload);

process.exit(0)

async function iterator(array = [], iterationsPerCore = 0, maxPages = 0) {
  console.log(array, maxPages)
  try {
    for await (const decimal of array) {
      let pages = [];

      const allPage = (decimal + 1) * maxPages;
      const arraySize = allPage > iterationsPerCore * 10
        ? iterationsPerCore * 10 - (decimal * maxPages)
        : maxPages;
      console.log(allPage, arraySize)
      pages = new Array(arraySize).fill(0).map((i, index) => decimal * maxPages + (index + 1));
    
      console.log(pages);
      // await converter.convertBulk(sourcePath, pages);
    }
    return process.exit(0);
  } catch (error) {
    throw new Error(error);
  }
}

const maxPages = 10;
const maxDecimal = Math.ceil((totalPages) / maxPages);
const iterations = new Array(maxDecimal).fill(0).map((i, ind) => ind);

const iterationsPerCore = Math.ceil(Math.ceil(totalPages / CPUs) / 10);

const x = totalPages.reduce((arr, page) => {
  for (let i = 0; i < CPUs; i += 1) {

  }
}, []);

if (cluster.isMaster) {
  // console.log('-- MASTER', iterationsPerCore)
  for (let i = 0; i < CPUs; i += 1) {
    // console.log('-- forking:', i);
    cluster.fork({ workerId: i });
  }
} else {
  // const start = process.env.workerId * iterationsPerCore;
  // const end = start + iterationsPerCore;
  // const arr = iterations.slice(start, end);
  // console.log('-- worker', process.env.workerId, totalPages, arr)
  // return iterator(arr, iterationsPerCore, maxPages);
  
}
