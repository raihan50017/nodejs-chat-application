const express = require("express");
const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const {
  doLoginValidator,
  doLoginValidationHandler,
} = require("../middleware/login/loginValidator");

const router = express.Router();

router.get("/", decorateHtmlResponse("Login page"), getLogin);

router.post(
  "/",
  decorateHtmlResponse("Login Page"),
  doLoginValidator,
  doLoginValidationHandler,
  login
);

router.delete("/", logout);

module.exports = router;
