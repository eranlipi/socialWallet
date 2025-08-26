"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      // define association here
    }
  }
  Business.init(
    {
      businessID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      logoURL: { type: DataTypes.STRING },
      phoneNumber: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      websiteURL: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Business",
    }
  );
  return Business;
};
