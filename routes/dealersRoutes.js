const express = require("express");
const {
  createDealer,
  dealerLogin,
} = require("../controllers/dealerController");
const router = express.Router();

// Register company (Admin)
router.post("/register", createDealer);
router.post("/signin", dealerLogin);

module.exports = router;
