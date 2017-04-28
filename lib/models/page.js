// dependencies
const mongoose = require('mongoose');

// Page document Schema
var pageSchema = mongoose.Schema({
    url: String,
    content: String,
    creationDate: Date
});

module.exports = mongoose.model('Page', pageSchema);