const { fromPath } = require('pdf2pic');

process.on(
  'message',
  async ({
    options = {},
    pages = [],
    source = '',
    worker = null,
  }) => {
    console.log(`-- worker ${worker} is up`);

    // eslint-disable-next-line
    for await (const page of pages) {
      console.log(`> converting page ${page} [worker ${worker}]`);
      await fromPath(
        source,
        {
          ...options,
          saveFilename: 'page',
        },
      ).bulk(
        [page],
        false,
      );
    }

    console.log(`-- worker ${worker} is done`);
    return process.exit(0);
  },
);
