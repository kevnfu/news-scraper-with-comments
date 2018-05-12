'use strict';
const scraper = require('../lib/news-scraper.js');
const router = require('express').Router();

router.get('/scrape', (req, res) => {
  scraper.scrapeNYT().then(articles => {
    res.json(articles);
  });
});

router.get()

module.exports = router;