const express = require("express");
const {
  getInbox,
  searchUser,
  addConversation,
  getMessage,
  sendMessage,
} = require("../controller/inboxController");
const decorateHtmlResponse = require("../middleware/common/decorateHtmlResponse");
const checkLogin = require("../middleware/common/checkLogin");
const attachmentUpload = require("../middleware/inbox/attachmentUpload");

const router = express.Router();

router.get("/", decorateHtmlResponse("Inbox page"), checkLogin, getInbox);

router.post("/search", checkLogin, searchUser);

router.post("/conversation", checkLogin, addConversation);

router.get("/messages/:conversation_id", checkLogin, getMessage);

router.post("/message", checkLogin, attachmentUpload, sendMessage);

module.exports = router;
