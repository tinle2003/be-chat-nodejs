const { body } = require("express-validator");

module.exports = {
  getChapterByComic: [
    body("token").notEmpty().isInt().withMessage("Id is required"),
  ],
  fetchDetailMessage:[
    body('messageId').notEmpty().isInt().withMessage("messageId is required")
  ],
  inviteChat: [
    body("idUserInvite")
      .notEmpty()
      .isInt()
      .withMessage("ID User invite is required"),
  ],
  sendMessage: [
    body("messageId").notEmpty().isInt().withMessage("ID message is required"),
    body("content").notEmpty().withMessage("Content not null"),
  ],
  acceptMessage: [
    body("id").notEmpty().isInt().withMessage("ID Message is required"),
    body("status").notEmpty().withMessage("status is required"),
  ],
  initTokenDevice: [body("token").notEmpty().withMessage("Token is required")],
  unInitTokenDevice: [
    body("token").notEmpty().withMessage("Token is required"),
  ],
};
