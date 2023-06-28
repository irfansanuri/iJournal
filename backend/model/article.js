var mongoose = require("mongoose");

var Schema = mongoose.Schema;

(articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  author: String,
  editor: String,
  reviewer: Array,
  year: Number,
  field: String,
  category: String,
  notes: Array,
  dateline: Date,
  path: String,
  uploadTime: {
    type: Date,
    default: Date.now
  }
})),
  (Article = mongoose.model("Article", articleSchema));

module.exports = Article;