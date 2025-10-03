const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Middleware: check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'You must be logged in to book.');
  res.redirect('/login');
}

// Show booking page
router.get('/', isAuthenticated, bookingController.showBookingPage);

// Book a slot
router.post('/reserve', isAuthenticated, bookingController.reserveSlot);

// Show user's booking history
router.get('/history', isAuthenticated, bookingController.showHistory);

// Cancel a booking
router.post('/:id/cancel', isAuthenticated, bookingController.cancelBooking);

module.exports = router;
