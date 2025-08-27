const express = require("express");
const router = express.Router();
const handleRequest = require("../utils/requestHandler");

router.post("/", handleRequest("wallet", "addCard"));
router.delete("/", handleRequest("wallet", "removeCard"));
router.get("/", handleRequest("wallet", "getWallet"));

module.exports = router;
