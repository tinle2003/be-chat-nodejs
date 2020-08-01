module.exports = (sequelize, type) => {
  return sequelize.define(
    "tb_token",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: type.STRING,
      },
      idUsers: {
        type: type.STRING,
      },
      type: {
        type: type.INTEGER,
        defaultValue: 0,
      },
    },
    {
      modelName: "token",
      timestamps: true,
      engine: "MYISAM",
    }
  );
};
