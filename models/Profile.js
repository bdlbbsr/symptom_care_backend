// profileModel.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    unique: true,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  location: String,
  gender: String,
  state: String,
  city:String,
  street:String,
  postalCode:String,
  mobile:String
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
