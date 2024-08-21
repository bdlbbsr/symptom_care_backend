module.exports = {
  service: 'gmail',
  auth: {
    user: process.env.SEND_USERNAME,
    pass: process.env.SEND_PASSWORD,
  },
  activationEmail: {
    from: process.env.SEND_USERNAME,
    subject: 'Activate Your Account',
    text: (activationLink) => `Click on the following link to activate your account: ${activationLink}`,
  },
  resetPassword: {
    from: process.env.SEND_USERNAME,
    subject: 'Reset Your Password',
    text: (resetLink) => `Click on the following link to reset your password: ${resetLink}`,
  },
};