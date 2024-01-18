const createHttpError = require("http-errors");

const requireRole = (role) => (req, res, next) => {
  if (req.user.role && role.includes(req.user.role)) {
    next();
  } else {
    if (res.locals.html) {
      next(createHttpError(401, "You are not authorized user!!"));
    } else {
      res.status(401).json({
        errors: {
          common: {
            msg: "You are not authorized",
          },
        },
      });
    }
  }
};

module.exports = requireRole;
