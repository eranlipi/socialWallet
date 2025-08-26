const express = require("express");
const router = express.Router();
const handleRequest = require("../utils/requestHandler");

router.post("/signup", handleRequest("business", "signUp"));
router.post("/signin", handleRequest("business", "signIn"));

module.exports = router;
