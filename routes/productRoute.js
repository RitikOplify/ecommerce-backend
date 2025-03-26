const express = require("express");
const router = express.Router();
const { createProduct } = require("../controllers/productController");
const { isAdmin } = require("../middlewares/auth");

router.post("/create", isAdmin,createProduct);

module.exports = router;
