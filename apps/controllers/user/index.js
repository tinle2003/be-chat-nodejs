var express = require("express");
var router = express.Router();
const Users = require('./user')
const validate = require("./validate");


router.post("/login",validate.login,Users.login)
router.post("/register",validate.register,Users.register)
router.post("/detail",Users.fetchUserDetail)


module.exports = router;
