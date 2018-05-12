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
  // array of comment ids
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

articleSchema.statics.findByUrl = function(url) {
  return this.find({url});
}

articleSchema.statics.createIfNew = function(article) {
  this.find({url: article.url}).then(result => {
    if(result.length == 0) {
      this.create(article);
    } else {
      return;
    }
  });
}

articleSchema.methods.addComment = function(comment) {
  this.comments.push(comment);
}

module.exports = mongoose.model('Article', articleSchema);