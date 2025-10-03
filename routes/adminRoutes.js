const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/', isAdmin, adminController.dashboard);

// Cancel a booking (admin override)
router.post('/bookings/:id/cancel', isAdmin, adminController.cancelBooking);

module.exports = router;
