"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class conversationUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      conversationUsers.belongsTo(models.User, { foreignKey: "userId" });
      conversationUsers.belongsTo(models.conversation);
    }
  }
  conversationUsers.init(
    {
      userId: DataTypes.INTEGER,
      conversationId: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {
      defaultScope: {
        where: {
          deletedAt: null,
        },
      },
      sequelize,
      modelName: "conversationUsers",
    }
  );
  return conversationUsers;
};
