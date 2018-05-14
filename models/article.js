const mongoose = require('mongoose');
const {Schema} = mongoose;

let articleSchema = new Schema({
  title: String,
  url: {
    type: String,
    unique: true
  },
  byline: String,
  summary: String,
  dateAdded: {
    type: Date,
    default: Date.now
  },
  // array of comment ids
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

articleSchema.statics.findByUrl = function(url) {
  return this.find({url});
}

/**
 * Add if there is no article w/ same url is in the database.
 * add
 * @param  {Object} article
 * @return {Promise} that resolves true if added, false if not added.
 */
articleSchema.statics.createIfNew = function(article) {
  return this.find({url: article.url}).then(result => {
    if(result.length == 0) {
      this.create(article);
      return true;
    } else {
      return false;
    }
  });
}

articleSchema.methods.addComment = function(comment) {
  this.comments.push(comment);
  return this.save();
}

module.exports = mongoose.model('Article', articleSchema);