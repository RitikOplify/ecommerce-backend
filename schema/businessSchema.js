const { z } = require("zod");

exports.businessSchema = z.object({
  gstNumber: z
    .string()
    .min(15, "GST Number must be 15 characters")
    .max(15, "GST Number must be 15 characters"),
  businessName: z.string().min(1, "Business Name is required"),
  businessEmail: z.string().email("Invalid email format"),
});
