var mongoose = require('mongoose');

var Schema = mongoose.Schema;

categorySchema = new Schema( {
    name: String,
    field: String,
    articles: Array
}),
Category = mongoose.model('Category', categorySchema);

module.exports = Category;