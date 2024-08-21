const { ResetPassword } = require("../controllers/ResetPassword");

// Password strength check function
const isPasswordStrong = (password) => {
  // `password.length >= 8`: Checks if the password is at least 8 characters long.
  // `/[a-z]/.test(password)`: Checks if the password contains at least one lowercase letter.
  // `/[A-Z]/.test(password):` Checks if the password contains at least one uppercase letter.
  // `/\d/.test(password)`: Checks if the password contains at least one digit (numeric character).
  // `/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)`: Checks if the password contains at least one special character from the specified set.

  // return password.length >= 8 &&
  // /[a-z]/.test(password) &&
  // /[A-Z]/.test(password) &&
  // /\d/.test(password) &&
  // /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
//console.log("passwordutil", password, password.length)
  return password.length >= 8;
};

module.exports = { isPasswordStrong };