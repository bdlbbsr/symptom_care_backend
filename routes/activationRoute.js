const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Activation endpoint
router.get('/activate/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Verify and decode the activation token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is still valid
    const user = await User.findOne({ email: decoded.email, activationToken: token, activationExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired activation link.' });
    }

    // Activate the user account
    user.isActive = true;
    user.activationToken = undefined;
    user.activationExpires = undefined;
    user.activatedAt = new Date(Date.now()),
    await user.save();

    res.status(200).json({ message: 'Account activated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;