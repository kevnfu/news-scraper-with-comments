let cheerio = require('cheerio');
let request = require('request');

/**
 * Wraps request/cheerio into a promise.
 * Usage: cheerioPromise("http://...").then($ => $('#id').text());
 *
 * @param  {String}
 * @return {Promise}
 */
function cheerioPromise(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, html) => {
      if(err) { return reject(err); }

      resolve(cheerio.load(html, { normalizeWhitespace: true }));
    });
  });
}

module.exports = cheerioPromise;