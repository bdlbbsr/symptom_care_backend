const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  country: {
    type: String,
    required: true
  },
  photo: String,
  department: String,
  experienceyrs: Number,
  degrees: String,
  experiences: String,
  location: String,
  gender: String,
  state: String,
  city:String,
  street:String,
  postalCode:Number,
  mobile:String,
  password: String,
  resetToken: String,
  resetTokenExpires: Date,
  activationToken: String,
  activationExpires: Date,
  profilePic:String,
  role: {
    type: String,
    enum: ['user', 'admin', 'doctor'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  activatedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;