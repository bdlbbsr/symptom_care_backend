const AboutPage = require('../models/About');

exports.getAboutPage = async (req, res) => {
  try {
    const aboutPage = await AboutPage.findOne();
    res.json(aboutPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAboutPage = async (req, res) => {
  try {
    const updatedAboutPage = await AboutPage.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.json(updatedAboutPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
