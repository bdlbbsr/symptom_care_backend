const express = require('express');
const User = require('../models/User');
const Profile = require('../models/Profile');

// // Protected route
exports.UserProfile = async (req, res) => {
  // Access user ID from req.userId
  const userId = req.userId;

  res.json({ message: `Profile route accessed by user with ID: ${userId}` });
};

// // profileController.js

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming user ID is available in the request object

    const profile = await Profile.findOne({ user: userId }).populate('user', '-password');

    if (userId && !profile) {
      const newProfile = new Profile({
        gender: ''
      });
      await Profile.create({ user: userId, ...newProfile });
    }

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profileData = req.body;

    // Find and update user profile
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      // Create new profile if not found
      profile = await Profile.create({ user: userId, ...profileData });
    } else {
      // Update existing profile
      Object.assign(profile, profileData);
      await profile.save();
    }

    // Update user information
    let user = await User.findById(userId);
    if (user) {
      Object.assign(user, profileData);
      await user.save();
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { userId, newAddress } = req.body;
    // const userId = req.userId;
    // const newAddress = req.body;

    
    // Find the user by ID and update their addresses
    //const profile = await Profile.findById(userId);
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    profile.addresses.push(newAddress);
    await profile.save();

    res.status(200).json({ success: true, data: profile.addresses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
