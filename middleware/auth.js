const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Token missing' });
  }

  // Check if the token starts with 'Bearer '
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please login first' });
  }

  // Remove 'Bearer ' prefix from the token
  // const authToken = token.substring(7);
  const authToken = token.split(' ')[1];
   
  jwt.verify(authToken, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    
    if (err) {

      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

module.exports = { authenticateUser };