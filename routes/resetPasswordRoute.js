const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { jwtOptions } = require('../utils/constants');
const { isPasswordStrong } = require('../utils/passwordUtils');

const router = express.Router();

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

     // Check if the password meets the strength criteria
    if (!isPasswordStrong(newPassword)) {
      return res.status(400).json({ message: 'Password should be at least 8 characters long.' });
    }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [jwtOptions.algorithm],
    });

    // Find user by decoded user ID
    const user = await User.findById(decoded.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the reset token is still valid
    if (user.resetToken !== token || user.resetTokenExpires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Reset password and remove reset token
    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
