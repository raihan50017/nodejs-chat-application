const { check, validationResult } = require("express-validator");
const doLoginValidator = [
  check("username").isLength({ min: 1 }).withMessage("User name is required"),
  check("password").isLength({ min: 1 }).withMessage("Password is required"),
];

doLoginValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.locals.data = { ...req.body };
    res.locals.errors = mappedErrors;
    res.render("index");
  }
};

module.exports = {
  doLoginValidationHandler,
  doLoginValidator,
};
