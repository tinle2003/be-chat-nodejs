const { User, Message, Token, MessageDetail } = require("../../../sequelizes");
const Op = require("sequelize").Op;
const sequelize = require("sequelize").Sequelize;
const { validationResult } = require("express-validator");
const Auth = require("../../middlewares/auth");

const Admin = require("../../middlewares/firebase");
const sendNotification = async (token, data) => {
  const messages = {
    notification: {
      title: `Bạn có lời mời nhắn tin mới từ ${data.username}`,
    },
    data: data,
    token,
  };
  return Admin.messaging()
    .send(messages)
    .then((data) => console.log(data))
    .catch((err) => {
      console.log(err);
    });
};

const fetchDetailMessage = async (req, res) => {
  try {
    validationResult(req).throw();
    let { messageId } = req.body;

    await Auth(req);
    let { count, rows } = await MessageDetail.findAndCountAll({
      where: {
        messageId,
      },
      order: [["updatedAt", "DESC"]],
      include: Message,
      limit: 10,
    });

    res.status(200).json({
      success: true,
      stt: 0,
      data: rows,
      pages: Math.ceil(count / 10),
    });
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const getListMessage = async (req, res) => {
  try {
    let USERS = await Auth(req);
    let MessageList = await Message.findAll({
      where: {
        status: ["ACCEPT", "WAITING-ACCEPT"],
        includeUsers: {
          [Op.like]: `%${USERS.id}%`,
        },
      },
    });

    let Messages = MessageList.map(async (data) => {
      let abb = data.includeUsers.split(",").map(async (IncludeData) => {
        let asd = await User.findAll({
          where: {
            id: IncludeData,
          },
          attributes: ["id", "name", "username", "createdAt", "updatedAt"],
        });
        return asd[0]["dataValues"];
      });
      let asdd = await Promise.all(abb);
      return Object.assign(data["dataValues"], { users: asdd });
    });

    await Promise.all(Messages);
    res.status(200).json(MessageList);
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const inviteChat = async (req, res) => {
  try {
    validationResult(req).throw();

    let { name, idUserInvite } = req.body;
    let UserProfile = await Auth(req);

    let MessageData = await Message.findAll({
      where: {
        ownerMessage: UserProfile.id,
        includeUsers: {
          [Op.like]: `%${idUserInvite}%`,
        },
      },
    });

    if (idUserInvite == UserProfile.id) {
      throw { stt: 2, msg: "Can't add you!!", success: false };
    }

    if (MessageData.length > 0) {
      throw { stt: 3, msg: "User is exist in chat list", success: false };
    }

    let createMessageQuery = await Message.create({
      ownerMessage: UserProfile.id,
      includeUsers: `${idUserInvite}`,
      name: UserProfile.username,
    });

    if (createMessageQuery) {
      
      let dataToken = await Token.findAll({
        where: { idUsers: idUserInvite, type: 0 },
      });

      if (dataToken.length > 0) {
        let payload = {
          username: UserProfile.username,
          callBack: "INVITE_MESSAGE",
        };
        dataToken.map((datas) => {
          console.log(datas)
          sendNotification(datas.token, payload);
        });
      }

      // if (dataToken.length > 0) {
      //   dataToken.map((datas) => {
      //     sendNotification(datas.token, { username: UserProfile.username });
      //   });
      // }

      res.status(200).json({
        data: createMessageQuery,
        success: true,
        msg: "Update success",
        stt: 0,
      });
    } else {
      throw {
        stt: 1,
        success: false,
        msg: "Error create message",
      };
    }
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const getListMessageDetail = async (req, res) => {
  try {
    validationResult(req).throw();

    let Profile = await Auth(req);
    let { messageId } = req.body;
    let messagesList = await MessageDetail.findAll({
      messageId,
    });

    res.status(200).json({ success: true, stt: 0, data: messagesList });
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const sendMessage = async (req, res) => {
  try {
    validationResult(req).throw();

    let { messageId, content, idReceiver } = req.body;

    let Profile = await Auth(req);

    let createMessage = await MessageDetail.create({
      sender: Profile.username,
      content,
      messageId,
      tbMessageId: messageId,
    });

    if (createMessage) {
      let dataToken = await Token.findAll({
        where: { idUsers: idReceiver, type: 0 },
      });

      if (dataToken.length > 0) {
        let payload = {
          // username: Profile.username,
          callBack: "Message",
        };
        dataToken.map((datas) => {
          console.log(datas)
          sendNotification(datas.token, payload);
        });
      }
    }
    res.status(200).json({ success: true, stt: 0 });
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const acceptMessage = async (req, res) => {
  try {
    validationResult(req).throw();

    
    let { id, status ,idReceiver} = req.body;
    let selectMessage = await Message.findAll({
      where: {
        id,
      },
    });

    let updateQuery = await Message.update(
      {
        status,
        includeUsers: sequelize.fn(
          "CONCAT",
          sequelize.col("includeUsers"),
          `,${selectMessage[0]["ownerMessage"]}`
        ),
      },
      { where: { id } }
    );
    if (updateQuery.length > 0) {
      if(status == "ACCEPT"){
        let dataToken = await Token.findAll({
          where: { idUsers: idReceiver, type: 0 },
        });
  
        if (dataToken.length > 0) {
          let payload = {
            username: idReceiver,
            callBack: "ACCEPT",
          };
          dataToken.map((datas) => {
            sendNotification(datas.token, payload);
          });
        }
      }

      res.status(200).json({ success: true, msg: "Update success", stt: 0 });
    } else {
      throw {
        stt: 1,
        success: false,
        msg: "Not found",
      };
    }
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const initTokenDevice = async (req, res) => {
  try {
    validationResult(req).throw();

    let { token } = req.body;
    let Profile = await Auth(req);

    let dataToken = await Token.findAll({
      where: {
        token,
        type: 0,
      },
    });
    if (dataToken.length == 0) {
      await Token.create({
        token,
        idUsers: Profile.id,
      });
    }

    res.status(200).json({ stt: 0, success: true });
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};

const unInitTokenDevice = async (req, res) => {
  try {
    validationResult(req).throw();

    let { token } = req.body;

    let queryUpdate = await Token.update(
      {
        type: 1,
      },
      {
        where: {
          token,
        },
      }
    );

    res.status(200).json({ stt: 0, success: true, queryUpdate });
  } catch (err) {
    res.status(500).json((err.errors && err.errors[0]) || err);
  }
};
module.exports = {
  getListMessage,
  inviteChat,
  sendMessage,
  acceptMessage,
  initTokenDevice,
  unInitTokenDevice,
  fetchDetailMessage,
  getListMessageDetail,
};
