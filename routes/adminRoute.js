const express = require("express");
const {
  registerCompany,
  createSalesExecutive,

  viewAllLeads,
  viewAllDealers,
  viewAllSalesExecutives,
  createCategory,
  createSubcategory,
  createProduct,
  getAllCategories,
  getSubcategoriesByCategory,
  getAllProducts,
  login,
  approveDealer,
  currentAdmin,
} = require("../controllers/adminController");

const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const router = express.Router();

// Register company (Admin)
router.post("/register", registerCompany);
router.post("/signin", login);
router.get("/current", isAuthenticated, isAdmin, currentAdmin);

// Create Sales Executive
router.post("/sales-executive", isAuthenticated, isAdmin, createSalesExecutive);
router.post(
  "/approve-dealer/:dealerId",
  isAuthenticated,
  isAdmin,
  approveDealer
);

// Create Dealer
// router.post("/dealer", isAuthenticated, isAdmin, createDealer);

// View all leads
router.get("/leads", isAuthenticated, isAdmin, viewAllLeads);

// View all dealers
router.get("/dealers", isAuthenticated, isAdmin, viewAllDealers);

// View all sales executives
router.get(
  "/sales-executives",
  isAuthenticated,
  isAdmin,
  viewAllSalesExecutives
);

router.post("/category", isAuthenticated, isAdmin, createCategory);
router.get("/categories", isAuthenticated, isAdmin, getAllCategories);

// Subcategory Routes
router.post("/subcategory", isAuthenticated, isAdmin, createSubcategory);
router.get(
  "/category/:categoryId/subcategories",
  isAuthenticated,
  isAdmin,
  getSubcategoriesByCategory
);

// Product Routes
router.post("/product", isAuthenticated, isAdmin, createProduct);
router.get("/products", isAuthenticated, isAdmin, getAllProducts);
router.get("/logout", (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
