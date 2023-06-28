var mongoose = require('mongoose');

var Schema = mongoose.Schema;

fieldSchema = new Schema( {
    name: String,
    categories: Array
}),
Field = mongoose.model('Field', fieldSchema);

module.exports = Field;