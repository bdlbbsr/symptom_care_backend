const express = require('express');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { jwtOptions } = require('../utils/constants');
const { sendResetPasswordEmail } = require('../utils/sendEmail');
// const { isPasswordStrong } = require('../utils/passwordUtils');

exports.ResetPassword = async (req, res) => {
  try {
    
    const  token  = req.body.token;
    const  newPassword  = req.body.newPassword;

    // Check if the password meets the strength criteria
    // if (!isPasswordStrong(newPassword)) {
    //   return res.status(400).json({ message: 'Password should be at least 8 characters long.' });
    // }

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [jwtOptions.algorithm],
    });

    // Find user by decoded user ID
    const user = await User.findById(decoded.userId);

    //  console.log("user", user)

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
};

exports.ForgotPassword = async (req, res) => {
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
};