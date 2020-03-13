const PDF2Pic = require("pdf2pic");
const pdfjsLib = require('pdfjs-dist');

const density = 72;
const format = 'jpeg';
const size = '600x834';

const converter = new PDF2Pic({
  density,
  format,
  savedir: `${process.cwd()}/result`,
  savename: `page`,
  size,
});

const sourcePath = `${process.cwd()}/source/file.pdf`;

(async function convert() {
  try {
    const { numPages: totalPAges = null } = await pdfjsLib.getDocument(sourcePath);

    const maxPages = 10;
    const maxDecimal = Math.ceil((totalPAges) / maxPages);
    const iterations = new Array(maxDecimal).fill(0).map((i, ind) => ind);

    for await (const decimal of iterations) {
      let pages = [];

      const allPage = (decimal + 1) * maxPages;
      const arraySize = allPage > totalPAges ? totalPAges - (decimal * maxPages) : maxPages;
      pages = new Array(arraySize).fill(0).map((i, index) => decimal * maxPages + (index + 1));
      
      await converter.convertBulk(sourcePath, pages);
    }

    console.log('-- DONE');
    return process.exit(0);
  } catch (error) {
    throw new Error(error);
  }
}());
