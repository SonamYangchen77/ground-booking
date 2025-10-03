const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );
    req.flash('success', 'Registration successful. Please login.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'User already exists or error occurred.');
    res.redirect('/signup');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) {
      req.flash('error', 'No user found.');
      return res.redirect('/login');
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role   // 👈 store role here
    };

    req.flash('success', `Welcome back, ${user.name}!`);
    if (user.role === 'admin') {
      return res.redirect('/admin'); // redirect coordinators to dashboard
    }
    res.redirect('/bookings');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/login');
  }
};


exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};
