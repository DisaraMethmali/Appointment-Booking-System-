const jwt = require('jsonwebtoken');

// Middleware to authenticate users
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); // Replace with env variable in production
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check if the user is an admin
const adminCheck = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { auth, adminCheck };


