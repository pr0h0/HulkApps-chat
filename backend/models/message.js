"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      message.belongsTo(models.User, { foreignKey: "userId" });
      message.belongsTo(models.conversation, { foreignKey: "conversationId" });
    }
  }
  message.init(
    {
      text: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      conversationId: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "message",
    }
  );
  return message;
};
