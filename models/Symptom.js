const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Symptom name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
    },
    thumbnail: {
        type: String,
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

symptomSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


// symptomSchema.index({ description: 'text' });
symptomSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Symptom', symptomSchema);