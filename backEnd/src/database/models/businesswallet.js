"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusinessWallet extends Model {
    static associate(models) {
      models.Business.hasMany(models.BusinessWallet, {
        foreignKey: "businessID",
      });
      models.BusinessWallet.belongsTo(models.Business, {
        foreignKey: "businessID",
      });

      models.Business.hasMany(models.BusinessWallet, {
        foreignKey: "cardBusinessID",
      });
      models.BusinessWallet.belongsTo(models.Business, {
        foreignKey: "cardBusinessID",
      });
    }
  }
  BusinessWallet.init(
    {
      businessID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cardBusinessID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BusinessWallet",
    }
  );
  return BusinessWallet;
};
