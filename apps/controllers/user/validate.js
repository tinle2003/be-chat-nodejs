const { body } = require("express-validator");

module.exports = {
  getChapterByComic: [
      body('token').notEmpty().isInt().withMessage("Id is required")
  ],
  login:[
    body('username').notEmpty().withMessage("Username is required"),
    body('password').notEmpty().withMessage("Password is required")
  ],
  register:[
    body('username').notEmpty().withMessage("Username is required"),
    body('password').notEmpty().withMessage("Password is required"),
    body('repassword').notEmpty().withMessage("Re-password is required"),
  ]
};
