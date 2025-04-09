const { z } = require("zod");

exports.companyRegisterSchema = z.object({
  name: z.string().min(3, "Company name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
exports.loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
exports.createSalesExecutiveSchema = z.object({
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  companyId: z.string().uuid("Invalid company ID"),
});

exports.createDealerSchema = z.object({
  name: z.string().min(3, "Dealer name is required"),
  gstNo: z.string().min(15, "GST Number must be at least 15 characters"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(6, "Pincode must be 6 digits"),
  companyId: z.string().uuid("Invalid company ID"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

exports.createLeadSchema = z.object({
  name: z.string().min(3, "Lead name is required"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact number is required"),
  status: z.string(),
  stage: z.string(),
  source: z.string(),
  companyName: z.string().min(3, "Company name is required"),
  companyId: z.string().uuid("Invalid company ID"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode is required"),
  productId: z.string().uuid("Invalid product ID"),
  price: z.number().positive(),
  comments: z.string().optional(),
});

// Category Validation
exports.createCategorySchema = z.object({
  name: z.string().min(3, "Category name is required"),
});

// Subcategory Validation
exports.createSubcategorySchema = z.object({
  name: z.string().min(3, "Subcategory name is required"),
  categoryId: z.string().uuid("Invalid category ID"),
});

// Product Validation
exports.createProductSchema = z
  .object({
    name: z.string().min(3, "Product name is required"),
    companyId: z.string().uuid("Invalid company ID"),
    categoryId: z.string().uuid("Invalid category ID").optional(),
    subcategoryId: z.string().uuid("Invalid subcategory ID").optional(),
  })
  .refine((data) => data.categoryId || data.subcategoryId, {
    message: "Either categoryId or subcategoryId must be provided",
  });
