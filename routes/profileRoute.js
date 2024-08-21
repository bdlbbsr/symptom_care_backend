const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth');

// Protected route
router.get('/', authenticateUser, (req, res) => {

  // Access user ID from req.userId
  const userId = req.userId;
  res.json({ message: `Profile route accessed by user with ID: ${userId}` });
});

module.exports = router;