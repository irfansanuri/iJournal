var mongoose = require('mongoose');

var Schema = mongoose.Schema;

userSchema = new Schema( {
    fname:{
        type: String,
        required: true,
        unique: true
    },
    lname:{
        type: String,
        required: true,
        unique: true
    },
	email:{
        type: String,
        required: true,
        unique: true
    },
	password: {
        type:String,
        required:true
    },
	role:{
        type: String,
        required: true
    },
    field: String,
    category: String,
	date: {
        type: Date,
        default: Date.now
    },
    articles: Array,
    accesstoken: String,
    refreshtoken: String
}),
user = mongoose.model('User', userSchema);

module.exports = user;