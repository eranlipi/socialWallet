const Joi = require("joi");
const responseCreator = require("../utils/responseCreator");
const { sequelize, Sequelize } = require("../database/models");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");
const tokenManager = require("../utils/tokenManager");
const config = require("config");
var fs = require("fs");
const resolve = require("path").resolve;

const signUp = {
  security: {
    authenticationLayer: false,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      firstName: Joi.string()
        .pattern(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required()
        .label("First name"),
      lastName: Joi.string()
        .pattern(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required()
        .label("Last name"),
      email: Joi.string()
        .email({ tlds: true })
        .required()
        .label("Email address"),
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
    },
  },

  async handler(req, res) {
    try {
      const user = await sequelize.transaction(async (t) => {
        const userAccountExistance = await sequelize.models.UserAccount.findOne(
          {
            where: {
              email: req.body.email,
            },
          }
        );

        if (userAccountExistance) {
          if (userAccountExistance.thirdParty)
            throw new Error(
              "You are already registered using the google authorization service"
            );
          throw new Error("Email address is already registered");
        }

        const userData = { ...req.body };
        delete userData["email"];
        delete userData["password"];

        const encryptedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await sequelize.models.User.create(userData);
        await sequelize.models.UserAccount.create({
          userID: user.userID,
          email: req.body.email,
          password: encryptedPassword,
        });

        delete user.dataValues.createdAt;
        delete user.dataValues.updatedAt;
        user.dataValues.email = req.body.email;

        return user;
      });

      res.cookie(
        "accessToken",
        tokenManager.generateToken(
          { userID: user.userID },
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
            "Successfully registered the new user",
            user
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
      email: Joi.string()
        .email({ tlds: true })
        .required()
        .label("Email address"),
      password: Joi.string().required().label("Password"),
    },
  },

  async handler(req, res) {
    try {
      const user = await sequelize.transaction(async (t) => {
        const userAccount = await sequelize.models.UserAccount.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (!userAccount) throw new Error("Wrong Password or Email");

        if (userAccount.thirdParty)
          throw new Error(
            "You registered using the google authorization service, Please use the google sign in to access the account"
          );

        const isPasswordCorrect = await bcrypt.compare(
          req.body.password,
          userAccount.password
        );

        if (!isPasswordCorrect) throw new Error("Wrong Password or Email");

        const user = await sequelize.models.User.findOne({
          attributes: ["userID", "firstName", "lastName"],
          where: {
            userID: userAccount.userID,
          },
        });

        user.dataValues.email = userAccount.email;

        return user;
      });

      res.cookie(
        "accessToken",
        tokenManager.generateToken(
          { userID: user.userID },
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
          responseCreator("success", "User is successfully authenticated", user)
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

const updateProfile = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: true,
  },

  validationSchema: {
    body: {
      firstName: Joi.string()
        .pattern(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required()
        .label("First name"),
      lastName: Joi.string()
        .pattern(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .required()
        .label("Last name"),
      phoneNumber: Joi.string()
        .allow("")
        .optional()
        .pattern(/^[+0-9]+$/, "phone number (Characters allowed: 0-9, +)")
        .label("Phone number"),
      jobTitle: Joi.string()
        .allow("")
        .optional()
        .pattern(/^[a-z A-Z]+$/, "english character (a-z, A-Z)")
        .label("Job title"),
      linkedinURL: Joi.string()
        .allow("")
        .optional()
        .uri()
        .label("Linkedin account URL"),
      facebookURL: Joi.string()
        .allow("")
        .optional()
        .uri()
        .label("Facebook account URL"),
      twitterURL: Joi.string()
        .allow("")
        .optional()
        .uri()
        .label("Twitter account URL"),
      personalWebsiteURL: Joi.string()
        .allow("")
        .optional()
        .uri()
        .label("Personal website URL"),
    },
  },
  async handler(req, res) {
    try {
      await sequelize.models.User.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          jobTitle: req.body.jobTitle,
          linkedinURL: req.body.linkedinURL,
          facebookURL: req.body.facebookURL,
          twitterURL: req.body.twitterURL,
          personalWebsiteURL: req.body.personalWebsiteURL,
        },
        { where: { userID: req.user.userID } }
      );
      res
        .status(200)
        .send(responseCreator("success", "Profile updated successfully..."));
    } catch (e) {
      const errorMsg = e.message;
      console.log("Error");
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

const uploadProfilePicture = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: false,
  },

  async handler(req, res, next) {
    next();
  },
};

const getProfile = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: false,
  },
  async handler(req, res) {
    try {
      const profile = await sequelize.models.User.findOne({
        where: {
          userID: req.user.userID,
        },
        attributes: {
          exclude: ["updatedAt", "createdAt"],
        },
      });
      res
        .status(200)
        .send(
          responseCreator(
            "success",
            "Profile retrieved successfully...",
            profile
          )
        );
    } catch (e) {
      const errorMsg = e.message;
      console.log("Error");
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

const loadProfileImage = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: true,
  },
  validationSchema: {
    query: {
      userID: Joi.string().required(),
    },
  },
  async handler(req, res) {
    const fileName = resolve(`uploads/${req.query.userID}`);
    console.log(fileName);
    const readStream = fs.createReadStream(fileName);

    readStream.on("open", function () {
      readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on("error", function (err) {
      console.log("Error Stream");
      res.send("Error");
    });
  },
};

const logout = {
  security: {
    authenticationLayer: true,
    authorizationLayer: false,
    validationLayer: false,
  },

  async handler(req, res) {
    try {
      res.cookie(
        "accessToken",
        tokenManager.generateToken(
          {},
          config.get("ACCESS_TOKEN_SECRET"),
          `${-1 * 1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")}`
        ),
        {
          sameSite: "none",
          path: "/",
          expires: new Date(
            new Date().getTime() +
              -1 * 1000 * 60 * 60 * 24 * config.get("ACCESS_TOKEN_TIME")
          ),
          httpOnly: true,
          secure: true,
          signed: true,
        }
      );

      res
        .status(200)
        .send(responseCreator("success", "User is successfully signed out"));
    } catch (e) {
      res
        .status(400)
        .send(responseCreator("error", "Request can't be proceed"));
    }
  },
};

module.exports = {
  signUp,
  signIn,
  updateProfile,
  uploadProfilePicture,
  loadProfileImage,
  getProfile,
  logout,
};
