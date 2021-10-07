const { stat } = require('fs/promises');

/**
 * Check file accessibility
 * @param {string} path - path to the file
 * @returns {Promise<void>}
 */
const checkAccessibility = async (path = '') => {
  const stats = await stat(path);
  if (!stats.isFile()) {
    throw new Error('Provided path is incorrect!');
  }
};

/**
 * Convert the provided value to array
 * @param {number} value - value to convert
 * @param {boolean} hasZero - true if the resulting array should start with zero
 * @returns {number[]}
 */
const convertToArray = (
  value = null,
  hasZero = false,
) => new Array(value).fill(0).map((_, i) => (i + (!hasZero ? 1 : 0)));

/**
 * Split the pages array for the multi-threading
 * @param {number[]} pages - array of the page numbers
 * @param {number[]} threads - array of the available threads
 * @returns {number[][]}
 */
const splitPages = (
  pages = [],
  threads = [],
) => threads.map(
  (_, threadIndex) => pages.filter(
    (__, pageIndex) => ((threadIndex + pageIndex) % threads.length) === 0,
  ),
);

module.exports = {
  checkAccessibility,
  convertToArray,
  splitPages,
};
