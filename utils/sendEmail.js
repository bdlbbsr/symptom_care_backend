const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const { baseURL } = require('../config/serverConfig');
const APP_URL = 'http://localhost:3000'

// Function to send activation email
const sendActivationEmail = (email, token) => {
 const transporter = nodemailer.createTransport(emailConfig);

  const activationLink = `${baseURL}/api/auth/activate/${token}`;

  const mailOptions = {
    from: emailConfig.activationEmail.from,
    to: email,
    subject: emailConfig.activationEmail.subject,
    text: emailConfig.activationEmail.text(activationLink),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// Function to send password reset email
const sendResetPasswordEmail = (email, token) => {
  const transporter = nodemailer.createTransport(emailConfig);

  const resetLink = `${APP_URL}/reset-password/${token}`;

  const mailOptions = {
    from: emailConfig.resetPassword.from,
    to: email,
    subject: emailConfig.resetPassword.subject,
    text: emailConfig.activationEmail.text(resetLink),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Password reset email sent: ' + info.response);
    }
  });
};

module.exports = { sendActivationEmail, sendResetPasswordEmail };
