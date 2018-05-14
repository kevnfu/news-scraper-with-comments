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

app.get('/article', (req, res) => {
  db.Article.find().then(data => res.json(data));
});

app.get('/article/:id', (req, res) => {
  db.Article.findById(req.params.id)
    .populate('comments')
    .then(article => {
      res.json(article);
    });
});

app.post('/article/:id/comment', (req, res) => {
  Promise.all([
    db.Comment.create({ content: req.body.content }),
    db.Article.findById(req.params.id)
  ]).then(([comment, article]) => {
    article.addComment(comment._id);
  }).then(() => res.status(200).send('added'));
});

app.get('/comment', (req, res) => {
  db.Comment.find().then(data => res.json(data));
});

// scrapes the NYT homepage, addes article to database.
// returns the number of new articles added.
// {added: ###}
app.get('/scrape', (req, res) => {
  scraper.scrapeNYT().then(articles => {
    // create new if new article
    let promises = [];
    articles.forEach(a => {
      promises.push(db.Article.createIfNew(a));
    });

    return Promise.all(promises);
  }).then(createdArray => {
    let count = createdArray.reduce((a,b) => a+b);
    res.json({added: count});
  });
});


app.get('/', (req, res) => {
  db.Article.find().sort('-dateAdded').then(articles => {
    res.render('index', {articles, home:true});
  });
})


app.listen(PORT, () => {
  console.log('App listening on PORT ' + PORT);
});