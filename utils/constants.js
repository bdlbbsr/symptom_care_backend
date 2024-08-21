// JWT options
const jwtOptions = {
  activationExpires: '24h',
  activationDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  loginExpires: '24h',
  algorithm: 'HS256',
  authToken: 'authToken',
};

module.exports = {
  jwtOptions,
};