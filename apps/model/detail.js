module.exports = (sequelize, type) => {
  return sequelize.define(
    "tb_message_detail",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender: {
        type: type.STRING,
        allowNull: false,
      },
      messageId: {
        type: type.INTEGER,
        allowNull: false,
      },
      content:{
        type: type.TEXT,
        allowNull:false
      },
      type: {
        type: type.INTEGER,
        defaultValue: 0,
      },
    },
    { modelName: "MESSAGE_DETAIL", timestamps: true, engine: "MYISAM" }
  );
};
