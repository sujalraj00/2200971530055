const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortcode: { type: String, required: true, unique: true },
  expiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [{
    timestamp: Date,
    referrer: String,
    ip: String,
  }],
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);