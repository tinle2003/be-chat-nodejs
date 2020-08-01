var express = require("express");
var router = express.Router();
const chat = require('./chat')
const validate = require("./validate");

router.post("/list",chat.getListMessage)
router.post("/detail",validate.fetchDetailMessage,chat.fetchDetailMessage)

router.post("/invite",validate.inviteChat,chat.inviteChat)
router.post("/accept",validate.acceptMessage,chat.acceptMessage)
router.post("/send",chat.sendMessage)
router.post("/init",validate.initTokenDevice,chat.initTokenDevice)
router.post("/delete-token",validate.unInitTokenDevice,chat.unInitTokenDevice)
router.post("/getListMessageDetail",chat.getListMessageDetail)
module.exports = router;
