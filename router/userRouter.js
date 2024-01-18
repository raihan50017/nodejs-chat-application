const express = require("express");
const {
  getUser,
  addUser,
  removeUser,
} = require("../controller/userController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const avatarUpload = require("../middleware/users/avatarUpload");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middleware/users/userValidator");
const checkLogin = require("../middleware/common/checkLogin");
const requireRole = require("../middleware/common/requireRole");

const router = express.Router();

router.get(
  "/",
  decorateHtmlResponse("User page"),
  checkLogin,
  requireRole(["admin"]),
  getUser
);

router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidator,
  addUserValidationHandler,
  addUser
);

router.delete("/:id", checkLogin, requireRole(["admin"]), removeUser);

module.exports = router;
