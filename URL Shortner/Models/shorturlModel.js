// models/shorturlModel.js
const mongoose = require('mongoose');

const shorturlSchema = new mongoose.Schema({
  short_url: { type: Number, required: true, unique: true },
  original_url: { type: String, required: true },
});

module.exports = mongoose.model('ShortURL', shorturlSchema);
