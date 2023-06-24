"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      conversation.belongsTo(models.User, { foreignKey: "userId" });
      conversation.hasMany(models.conversationUsers, {
        foreignKey: "conversationId",
      });
      conversation.hasMany(models.message, { foreignKey: "conversationId" });
    }
  }
  conversation.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "conversation",
    }
  );
  return conversation;
};
