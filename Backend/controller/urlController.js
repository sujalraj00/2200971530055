const ShortUrl = require('../db/shortUrlModel');
const generateCode = require('../domain/codeGenerator');
const { Log } = require('../../Logging Middleware/logger');

const createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    await Log('backend', 'error', 'controller', 'Invalid URL input');
    return res.status(400).json({ message: 'Invalid or missing URL' });
  }

  let code = shortcode || generateCode();
  const exists = await ShortUrl.findOne({ shortcode: code });
  if (exists) {
    await Log('backend', 'warn', 'controller', 'Shortcode already in use');
    return res.status(409).json({ message: 'Shortcode already exists' });
  }

  const expiry = new Date(Date.now() + validity * 60 * 1000);
  const shortUrl = await ShortUrl.create({ originalUrl: url, shortcode: code, expiry });

  await Log('backend', 'info', 'controller', `Short URL created for ${url}`);
  return res.status(201).json({
    shortLink: `http://localhost:4000/${code}`,
    expiry: expiry.toISOString(),
  });
};

const getStats = async (req, res) => {
  const { shortcode } = req.params;
  const record = await ShortUrl.findOne({ shortcode });

  if (!record) {
    await Log('backend', 'error', 'controller', 'Shortcode stats not found');
    return res.status(404).json({ message: 'Shortcode not found' });
  }

  res.json({
    originalUrl: record.originalUrl,
    expiry: record.expiry,
    createdAt: record.createdAt,
    totalClicks: record.clicks.length,
    clickData: record.clicks,
  });
};

const redirectUrl = async (req, res) => {
  const { shortcode } = req.params;
  const record = await ShortUrl.findOne({ shortcode });

  if (!record) {
    await Log('backend', 'error', 'controller', 'Shortcode not found');
    return res.status(404).json({ message: 'Shortcode not found' });
  }

  if (new Date() > record.expiry) {
    await Log('backend', 'warn', 'controller', 'Shortcode expired');
    return res.status(410).json({ message: 'Link has expired' });
  }

  record.clicks.push({
    timestamp: new Date(),
    referrer: req.get('Referrer') || 'unknown',
    ip: req.ip,
  });
  await record.save();

  await Log('backend', 'info', 'controller', `Redirected to ${record.originalUrl}`);
  res.redirect(record.originalUrl);
};

module.exports = { createShortUrl, getStats, redirectUrl };