const express = require('express');
const router = express.Router();

// Import controller functions correctly
const authController = require('../controllers/authController');

// Define routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

