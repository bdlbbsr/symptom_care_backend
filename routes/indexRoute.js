const express = require('express');
const config = require('../config/appConfig');

const router = express.Router();

// Serve HTML for testing
router.get('/', (req, res) => {
  const data = {
    title: config.title,
  };
  res.render('index', data);
});

module.exports = router;