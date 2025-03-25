const express = require("express");
const { createAddress } = require("../controllers/addressController");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

router.post("/create", isAuthenticated, createAddress);

module.exports = router;
