const mongoose = require('mongoose');
const {Schema} = mongoose;

let commentSchema = new Schema({
  content: String
});

module.exports = mongoose.model('Comment', commentSchema);