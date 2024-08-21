const express = require('express');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../utils/sendEmail');
const { jwtOptions } = require('../utils/constants');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: jwtOptions.activationExpires,
      algorithm: jwtOptions.algorithm,
    });

    // Save the reset token in the user document
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + jwtOptions.activationDuration); // 24 hours
    await user.save();

    // Send password reset email
    sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
