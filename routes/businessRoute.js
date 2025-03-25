const express = require("express");
const { createBusiness } = require("../controllers/businessController");
const { isAuthenticated } = require("../middlewares/auth");

const router = express.Router();

router.post("/create", isAuthenticated, createBusiness);

module.exports = router;
