const config = require("config");
const Sequelize = require("sequelize").Sequelize;
const Type = require("sequelize").DataTypes;
const UserModel = require("./apps/model/users");
const MessageModel = require("./apps/model/message");
const MessageDetailModel = require("./apps/model/detail");
const TokenModel = require("./apps/model/tokenDivice");

var mysql = config.get("mysql");

const sequelize = new Sequelize(
  mysql.database,
  mysql.username,
  mysql.password,
  {
    host: mysql.host,
    dialect: "mysql",
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: mysql.logging,
  }
);

const User = UserModel(sequelize, Type);
const Message = MessageModel(sequelize, Type);
const MessageDetail = MessageDetailModel(sequelize, Type);
const Token = TokenModel(sequelize, Type);
User.hasMany(MessageDetail);
MessageDetail.belongsTo(Message)
Token.hasMany(User);

function syncAll() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync({
        force: mysql.sync,
      })
      .then(async () => {
        resolve();
      });
  });
}

module.exports = {
  syncAll,
  User,
  MessageDetail,
  Message,
  Token,
};
