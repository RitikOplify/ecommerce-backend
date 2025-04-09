const express = require("express");
const router = express.Router();
const {
  deleteUser,
  currentUser,
  login,
  getUsers,
  refreshToken,
  logOut,
  updateUser,
} = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/signin", login);
router.get("/", isAuthenticated, currentUser);
router.put("/update", isAuthenticated, updateUser);

router.get("/all", getUsers);
router.delete("/delete/:id", deleteUser);
router.get("/refresh", refreshToken);
router.get("/logout", logOut);

module.exports = router;
