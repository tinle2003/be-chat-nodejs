module.exports = (sequelize, type) => {
  return sequelize.define(
    "tb_message",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: type.STRING,
      },
      ownerMessage: {
        type: type.STRING,
      },
      includeUsers: {
        type: type.STRING,
      },
      status:{
        type: type.STRING,
        defaultValue: "WAITING-ACCEPT",
      },
      type: {
        type: type.INTEGER,
        defaultValue: 0,
      },
    },
    {
      modelName: "message",
      timestamps: true,
      engine: "MYISAM",
    }
  );
};
