const Joi = require("joi");
const responseCreator = require("../utils/responseCreator");
const { sequelize, Sequelize } = require("../database/models");

const addCard = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      cardBusinessID: Joi.string().required().label("Card Business ID"),
    },
  },

  async handler(req, res) {
    try {
      if (req.user.businessID === req.body.cardBusinessID) {
        return res
          .status(400)
          .send(
            responseCreator("error", "Can not add card of the same business")
          );
      }
      await sequelize.models.BusinessWallet.create({
        businessID: req.user.businessID,
        cardBusinessID: req.body.cardBusinessID,
      });
      res
        .status(200)
        .send(responseCreator("success", "Successfully added new card"));
    } catch (e) {
      const errorMsg = e.message;
      console.log(errorMsg);
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

const removeCard = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      cardBusinessID: Joi.string().required().label("Card Business ID"),
    },
  },

  async handler(req, res) {
    try {
      await sequelize.models.BusinessWallet.destroy({
        where: {
          businessID: { [Sequelize.Op.eq]: req.user.businessID },
          cardBusinessID: { [Sequelize.Op.eq]: req.body.cardBusinessID },
        },
      });

      res
        .status(200)
        .send(responseCreator("success", "Successfully removed card"));
    } catch (e) {
      const errorMsg = e.message;
      console.log(errorMsg);
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

const getWallet = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: false,
  },

  async handler(req, res) {
    try {
      const wallet = await sequelize.models.BusinessWallet.findAll({
        where: {
          businessID: { [Sequelize.Op.eq]: req.user.businessID },
        },
        include: sequelize.models.Business,
        attributes: { exclude: ["businessID", "cardBusinessID"] },
      });
      res
        .status(200)
        .send(
          responseCreator(
            "success",
            "Successfully retrieved wallet",
            wallet
          )
        );
    } catch (e) {
      const errorMsg = e.message;
      console.log(errorMsg);
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

module.exports = { addCard, removeCard, getWallet };
