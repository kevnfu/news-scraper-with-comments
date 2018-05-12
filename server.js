'use strict';
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const db = require('./models');

const scraper = require('./lib/news-scraper.js');
const app = express();

mongoose.connect(MONGODB_URI);

app.engine('.hbs', require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    section(name, options) {
      if (!this._sections) this._sections = {};

      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));
app.set('view engine', '.hbs');

// middleware
app.use(require('morgan')('dev'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use(require('./routes/api-routes.js'));

app.get('/all', (req, res) => {
  db.Article.find().then(data => res.json(data));
});

app.get('/scrape', (req, res) => {
  scraper.scrapeNYT().then(articles => {
    // create new if new article
    articles.forEach(a => db.Article.createIfNew(a));
    res.status(200).end();
  });
});


app.get('/', (req, res) => {
  db.Article.find().then(articles => {
    res.render('index', {articles});
  });
})

app.post('/comment', (req, res) => {

});

app.listen(PORT, () => {
  console.log('App listening on PORT ' + PORT);
});