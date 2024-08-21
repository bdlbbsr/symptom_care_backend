const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtOptions } = require('../utils/constants');

// Login endpoint
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Check if the account is activated
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account not activated. Please check your email for activation.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: jwtOptions.loginExpires, algorithm: jwtOptions.algorithm });

    // Set the token as an HTTP cookie
    res.cookie(jwtOptions.authToken, jwtToken, { httpOnly: true });
    
    res.json({ token: jwtToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;