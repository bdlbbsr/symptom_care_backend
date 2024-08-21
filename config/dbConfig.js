const mongoose = require('mongoose')
const Symptom = require('../models/Symptom');

const { MONGO_URI_DEV, MONGO_URI_PROD } = process.env;
const mongoURI = process.env.NODE_ENV === 'development' ? MONGO_URI_DEV : process.env.NODE_ENV === 'production' ? MONGO_URI_PROD : MONGO_URI_DEV

const connection = async () => {
  
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    await Symptom.init();
    console.log('Indexes created');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connection;

// module.exports = {
//   mongoURI:
//   process.env.NODE_ENV === 'development' ? MONGO_URI_DEV : process.env.NODE_ENV === 'production' ? MONGO_URI_PROD : MONGO_URI_DEV,
// };