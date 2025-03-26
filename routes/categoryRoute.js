const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth");

const {
  createMainCategory,
  createSubCategory,
  createSubCategoryLevel2,
} = require("../controllers/categoryController");

router.post("/main/create", isAdmin, createMainCategory);
router.post("/sub/create", isAdmin, createSubCategory);
router.post("/sub-level2/create", isAdmin, createSubCategoryLevel2);

module.exports = router;
