// authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    console.log('Token received:',token); // Debugging statement
  
    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }
  
    jwt.verify(token, "6c730a8a5d4671897f8f254fe2b0abef2374fcd4d788baf7c8bde3e7c9e9da18", (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token.' });
      }
      console.log('Decoded user:', JSON.stringify(decodedUser, null, 2));
      req.user = decodedUser; // Attach user info to the request object
      next(); // Pass control to the next handler
    });
  };

module.exports = authenticateToken;
