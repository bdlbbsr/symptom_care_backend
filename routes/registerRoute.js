const express = require('express');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/User');
const { sendActivationEmail } = require('../utils/sendEmail');
const { jwtOptions } = require('../utils/constants');
const { isPasswordStrong } = require('../utils/passwordUtils');

const router = express.Router();

// Registration endpoint
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate email and other inputs
    if (!validator.isEmail(email) || validator.isEmpty(firstName) || validator.isEmpty(lastName) || validator.isEmpty(password)) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }

    // Sanitize inputs
    const sanitizedFirstName = validator.escape(firstName);
    const sanitizedLastName = validator.escape(lastName);
    const sanitizedEmail = validator.normalizeEmail(email, { gmail_remove_dots: false });
    const sanitizedPassword = validator.escape(password);

    // Check if the password meets the strength criteria
    if (!isPasswordStrong(sanitizedPassword)) {
      return res.status(400).json({ message: 'Password should be at least 8 characters long.' });
    }
    
    // Check if the email already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Generate activation token and expiration date
    const activationToken = jwt.sign({ email: sanitizedEmail }, process.env.JWT_SECRET, { expiresIn: jwtOptions.activationExpires });

    // Save user data to the database
    const newUser = new User({
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      email: sanitizedEmail,
      password: sanitizedPassword,
      // password: await bcrypt.hash(password, 10),
      activationToken,
      activationExpires: new Date(Date.now() + jwtOptions.activationDuration), // 24 hours
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });

    await newUser.save();

    // Send activation email
    sendActivationEmail(newUser.email, activationToken);

    res.status(201).json({ message: 'User registered successfully. Please check your email for activation.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;