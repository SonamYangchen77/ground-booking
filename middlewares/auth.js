function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'You must be logged in.');
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'You are not authorized to access this page.');
  res.redirect('/');
}

module.exports = { isAuthenticated, isAdmin };
