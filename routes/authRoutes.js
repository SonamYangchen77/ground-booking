const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup page
router.get('/signup', (req, res) => res.render('signup'));

// Signup logic
router.post('/signup', authController.register);

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login logic
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
