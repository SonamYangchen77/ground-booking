const pool = require('../config/db');

exports.dashboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.date, b.time_slot, u.name AS student_name, u.email 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.date, b.time_slot
    `);
    res.render('dashboard', { bookings: result.rows, user: req.session.user });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading dashboard.');
    res.redirect('/');
  }
};

exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    await pool.query('DELETE FROM bookings WHERE id=$1', [bookingId]);
    req.flash('success', 'Booking cancelled by admin.');
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error cancelling booking.');
    res.redirect('/admin');
  }
};
