const express = require("express");
const router = express.Router();
const { adminLogin, adminSignUp } = require("../controllers/adminController");

router.post("/signup", adminSignUp);
router.post("/signin", adminLogin);
// router.get("/logout", logOut);

module.exports = router;
