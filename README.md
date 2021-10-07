## PDF Cutter

Cuts and converts the provided PDF file into multiple image files.

### Deployment

Requires `ghostscript` and `graphicsmagick`:

```shell script
brew install graphicsmagick
brew install ghostscript
```

Install the project:

```shell script
git clone https://github.com/peterdee/pdf-cutter
cd ./pdf-cutter
nvm use 16
npm i
```

### Usage

Run the following script inside of the project directory:

```shell script
npm start ~/path/to/file.pdf
```

A new directory with the results of conversion is going to be created (named after a file)

### License

[MIT](./LICENSE.md)
