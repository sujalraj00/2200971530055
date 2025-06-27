const express = require('express');
const router = express.Router();
const { createShortUrl, getStats, redirectUrl } = require('../controller/urlController');

router.post('/', createShortUrl);
router.get('/:shortcode', getStats);
router.use('/:shortcode', redirectUrl);

module.exports = router;