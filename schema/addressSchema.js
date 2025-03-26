const { z } = require("zod");

exports.addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  alternatePhone: z.string().optional(),
  flatNo: z.string().min(1, "Flat number is required"),
  area: z.string().min(1, "Area is required"),
  landmark: z.string().optional(),
  pincode: z.string().min(6, "Pincode must be at least 6 digits"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  addressType: z.enum(["business", "delivery"], {
    errorMap: () => ({
      message: "Address type must be 'business' or 'delivery'",
    }),
  }),
});
