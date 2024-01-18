const { check, validationResult } = require("express-validator");
const People = require("../../modals/People");
const createHttpError = require("http-errors");
const fs = require("fs");
const path = require("path");

const addUserValidator = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim(),
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await People.findOne({ email: value });
        if (user) {
          throw createHttpError("Email already in use");
        }
      } catch (err) {
        throw createHttpError(err.message);
      }
    }),
  check("mobile")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Mobile number must be a valid Bangladeshi mobile number")
    .custom(async (value) => {
      try {
        const user = await People.findOne({ mobile: value });
        if (user) {
          throw createHttpError("Mobile already is use");
        }
      } catch (err) {
        throw createHttpError(err.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password should be at least 8 character(at least one uppercase, one numeric, and at least one special character"
    ),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      fs.unlink(
        `${__dirname}/../../public/uploads/avatars/${filename}`,
        (err) => {
          console.log(err);
        }
      );
    }

    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = {
  addUserValidationHandler,
  addUserValidator,
};
