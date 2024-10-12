const mongoose = require('mongoose');

const shorturlSchema = new mongoose.Schema({
    short_url: String,
    original_url: String,
    suffix: String
});

module.exports = mongoose.model('shorturl', shorturlSchema);
