// categoryModel.js

const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  description: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
