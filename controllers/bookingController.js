const pool = require('../config/db');

// Show available slots + booked slots
exports.showBookingPage = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY date, time_slot');
    res.render('booking', { bookings: result.rows, user: req.session.user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading bookings');
    res.redirect('/');
  }
};

// Reserve a slot
exports.reserveSlot = async (req, res) => {
  const { date, time_slot } = req.body;
  const userId = req.session.user.id;

  try {
    // Check if slot is already booked
    const existing = await pool.query(
      'SELECT * FROM bookings WHERE date=$1 AND time_slot=$2',
      [date, time_slot]
    );

    if (existing.rows.length > 0) {
      req.flash('error', 'That slot is already booked.');
      return res.redirect('/bookings');
    }

    // Count student bookings on the same date
    const dailyBookings = await pool.query(
      'SELECT COUNT(*) FROM bookings WHERE user_id=$1 AND date=$2',
      [userId, date]
    );

    if (parseInt(dailyBookings.rows[0].count) >= 1) {
      req.flash('error', 'You can only book once per day (2 hours max).');
      return res.redirect('/bookings');
    }

    // Insert booking
    await pool.query(
      'INSERT INTO bookings (user_id, date, time_slot) VALUES ($1, $2, $3)',
      [userId, date, time_slot]
    );

    req.flash('success', 'Booking confirmed!');
    res.redirect('/bookings/history');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error while booking slot.');
    res.redirect('/bookings');
  }
};


// Show user's booking history
exports.showHistory = async (req, res) => {
  const userId = req.session.user.id;
  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id=$1 ORDER BY date DESC',
      [userId]
    );
    res.render('history', { bookings: result.rows, user: req.session.user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading history.');
    res.redirect('/bookings');
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userId = req.session.user.id;

  try {
    // Delete only if booking belongs to the logged-in user
    await pool.query('DELETE FROM bookings WHERE id=$1 AND user_id=$2', [bookingId, userId]);
    req.flash('success', 'Booking cancelled.');
    res.redirect('/bookings/history');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cancelling booking.');
    res.redirect('/bookings/history');
  }
};
