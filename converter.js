const PDF2Pic = require("pdf2pic");

process.on('message', async ({ options = {}, pages = [], source = '', worker = null }) => {
  console.log(`-- worker ${worker} is up`);

  // create a new converter instance
  const converter = new PDF2Pic({
    density: options.density,
    format: options.format,
    savedir: `${process.cwd()}/result`,
    savename: 'page',
    size: options.size,
  });

  // convert pages
  for await (const page of pages) {
    console.log(`@@ running the converter for worker ${worker}: page ${page}`);
    await converter.convertBulk(source, [page]);
  }

  console.log(`-- worker ${worker} is done`);
  return process.exit(0);
});
