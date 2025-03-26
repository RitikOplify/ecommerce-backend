const { z } = require("zod");

exports.mainCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

exports.subCategorySchema = z.object({
  name: z.string().min(1, "Sub Category name is required"),
  mainCategoryId: z.string().min(1, "Main Category ID is required"),
});

exports.subCategoryLevel2Schema = z.object({
  name: z.string().min(1, "Sub Category Level 2 name is required"),
  subCategoryId: z.string().min(1, "Sub Category ID is required"),
});
