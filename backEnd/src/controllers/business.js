const Joi = require("joi");
const responseCreator = require("../utils/responseCreator");
const { sequelize } = require("../database/models");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const tokenManager = require("../utils/tokenManager");
const config = require("config");

const signUp = {
  security: {
    authenticationLayer: false,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      name: Joi.string().required().label("Business name"),
      email: Joi.string().email({ tlds: true }).required().label("Email address"),
      password: passwordComplexity({
        min: 8,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
      })
        .required()
        .label("Password"),
      logoURL: Joi.string().allow("").optional().uri().label("Logo URL"),
      phoneNumber: Joi.string()
        .allow("")
        .optional()
        .pattern(/^[+0-9]+$/, "phone number (Characters allowed: 0-9, +)")
        .label("Phone number"),
      address: Joi.string().allow("").optional().label("Address"),
      websiteURL: Joi.string().allow("").optional().uri().label("Website URL"),
    },
  },

  async handler(req, res) {
    try {
      const business = await sequelize.transaction(async (t) => {
        const businessAccountExistance = await sequelize.models.BusinessAccount.findOne(
          {
            where: {
              email: req.body.email,
            },
          }
        );

        if (businessAccountExistance) {
          if (businessAccountExistance.thirdParty)
            throw new Error(
              "You are already registered using the google authorization service"
            );
          throw new Error("Email address is already registered");
        }

        const businessData = { ...req.body };
        delete businessData["email"];
        delete businessData["password"];

        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        const business = await sequelize.models.Business.create(businessData);
        await sequelize.models.BusinessAccount.create({
          businessID: business.businessID,
          email: req.body.email,
          password: encryptedPassword,
        });

        delete business.dataValues.createdAt;
        delete business.dataValues.updatedAt;
        business.dataValues.email = req.body.email;

        return business;
      });

      res.cookie(
        "accessToken",
        tokenManager.generateToken(
          { businessID: business.businessID },
          config.get("ACCESS_TOKEN_SECRET"),
          `${1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")}`
        ),
        {
          sameSite: "none",
          path: "/",
          expires: new Date(
            new Date().getTime() +
              1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")
          ),
          httpOnly: true,
          secure: true,
          signed: true,
        }
      );

      res
        .status(200)
        .send(
          responseCreator(
            "success",
            "Successfully registered the new business",
            business
          )
        );
    } catch (e) {
      const errorMsg = e.message;

      switch (errorMsg) {
        case "Email address is already registered":
          res
            .status(400)
            .send(
              responseCreator("error", "Email address is already registered")
            );
          break;
        case "You are already registered using the google authorization service":
          res
            .status(400)
            .send(
              responseCreator(
                "error",
                "You are already registered using the google authorization service"
              )
            );
          break;
        default:
          res
            .status(400)
            .send(responseCreator("error", "Request can't be proceed"));
      }
    }
  },
};

const signIn = {
  security: {
    authenticationLayer: false,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      email: Joi.string().email({ tlds: true }).required().label("Email address"),
      password: Joi.string().required().label("Password"),
    },
  },

  async handler(req, res) {
    try {
      const business = await sequelize.transaction(async (t) => {
        const businessAccount = await sequelize.models.BusinessAccount.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (!businessAccount) throw new Error("Wrong Password or Email");

        if (businessAccount.thirdParty)
          throw new Error(
            "You registered using the google authorization service, Please use the google sign in to access the account"
          );

        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          businessAccount.password
        );

        if (!isPasswordCorrect) throw new Error("Wrong Password or Email");

        const business = await sequelize.models.Business.findOne({
          attributes: ["businessID", "name"],
          where: {
            businessID: businessAccount.businessID,
          },
        });

        business.dataValues.email = businessAccount.email;

        return business;
      });

      res.cookie(
        "accessToken",
        tokenManager.generateToken(
          { businessID: business.businessID },
          config.get("ACCESS_TOKEN_SECRET"),
          `${1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")}`
        ),
        {
          sameSite: "none",
          path: "/",
          expires: new Date(
            new Date().getTime() +
              1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")
          ),
          httpOnly: true,
          secure: true,
          signed: true,
        }
      );

      res
        .status(200)
        .send(
          responseCreator(
            "success",
            "Business is successfully authenticated",
            business
          )
        );
    } catch (e) {
      const errorMsg = e.message;
      console.log(errorMsg);

      switch (errorMsg) {
        case "Wrong Password or Email":
          res
            .status(401)
            .send(responseCreator("error", "Email or password is incorrect"));
          break;
        case "You registered using the google authorization service, Please use the google sign in to access the account":
          res
            .status(400)
            .send(
              responseCreator(
                "error",
                "You registered using the google authorization service, Please use the google sign in to access the account"
              )
            );
          break;
        default:
          res
            .status(400)
            .send(responseCreator("error", "Request can't be proceed"));
      }
    }
  },
};

const updateLogo = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: false,
  },

  async handler(req, res, next) {
    try {
      await sequelize.models.Business.update(
        { logoURL: `uploads/business/${req.user.businessID}` },
        { where: { businessID: req.user.businessID } }
      );
      next();
    } catch (e) {
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

module.exports = { signUp, signIn, updateLogo };
