const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/User');
const { sendActivationEmail } = require('../utils/sendEmail');
const { jwtOptions } = require('../utils/constants');
const { isPasswordStrong } = require('../utils/passwordUtils');


exports.Registration = async (req, res) => {

  try {
    const { fname, lname, email, country, password, role } = req.body;

  console.log("first", req.body)

    // Validate email and other inputs
    if (!validator.isEmail(email) || validator.isEmpty(fname) || validator.isEmpty(lname) || validator.isEmpty(country) || validator.isEmpty(password) || validator.isEmpty(role)) {
      return res.status(400).json({ message: 'Invalid input data.' });
    }

    // Sanitize inputs
    const sanitizedFname = validator.escape(fname);
    const sanitizedLname = validator.escape(lname);
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
      fname: sanitizedFname,
      lname: sanitizedLname,
      country: country,
      email: sanitizedEmail,
      password: sanitizedPassword,
      role: role,
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
};

exports.Login = async (req, res) => {
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

    res.json({ token: jwtToken, role: user.role, fname:user.firstName, userId:user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



exports.Logout = async (req, res) => {
  // res
  //   .cookie('jwt', null, {
  //     expires: new Date(Date.now()),
  //     httpOnly: true,
  //   })
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};