const { z } = require("zod");
exports.createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  about: z.string().optional(),
  details: z.string().optional(),
  warranty: z.string().optional(),
  subCategoryLevel2Id: z.string().min(1, "Sub Category Level 2 ID is required"),
  keyFeatures: z.array(z.string()).optional(),
  specifications: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional(),
});
