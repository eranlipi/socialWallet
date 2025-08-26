"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessAccount extends Model {
    static associate(models) {
      models.Business.hasOne(models.BusinessAccount, {
        foreignKey: "businessID",
      });
      models.BusinessAccount.belongsTo(models.Business, {
        foreignKey: "businessID",
      });
    }
  }
  BusinessAccount.init(
    {
      businessID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
      },
      thirdParty: { type: DataTypes.BOOLEAN, defaultValue: false },
      provider: DataTypes.STRING,
      providerUserID: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BusinessAccount",
    }
  );
  return BusinessAccount;
};
