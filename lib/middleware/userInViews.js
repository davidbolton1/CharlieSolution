// Basically used for the landing page
// Makes the user object available for use in all the routes
module.exports = function () {
  return function (req, res, next) {
    res.locals.user = req.user;
    next();
  };
};
