const express = require("express");
const router = express.Router();
const handleRequest = require("../utils/requestHandler");
const handleImageUpload = require("../utils/imageUploadHandler");

router.post("/signup", handleRequest("business", "signUp"));
router.post("/signin", handleRequest("business", "signIn"));
router.patch(
  "/logo",
  handleRequest("business", "updateLogo"),
  handleImageUpload("logo", "businessID")
);

module.exports = router;
