const cheerio = require('./cheerio-promise.js');

/**
 * Returns list of articles with {title, url, byline, summary}
 *
 * @return {Promise}
 */
async function getNYTHomepage() {
  let $ = await cheerio('https://www.nytimes.com/');

  let articles = [];
  $('article.story.theme-summary').each((i, article) => {
    article = $(article);
    let titleTag = article.find('h2.story-heading > a');
    let title = titleTag.text();
    if(title.length === 0) return; // ignore articles with no title

    let url = titleTag.attr('href');
    let byline = article.children('p.byline').text();
    let summary = article.children('p.summary').text().trim();
    articles.push({title, url, byline, summary});
  });

  // console.log(JSON.stringify(articles, null, 3));
  return articles;
}

exports.scrapeNYT = getNYTHomepage;