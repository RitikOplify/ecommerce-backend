const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const ErrorHandler = require("./utils/errorHandler");
const user = require("./routes/userRoutes");
const business = require("./routes/businessRoute");
const address = require("./routes/addressRoute");
const admin = require("./routes/adminRoute");

const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoute");
const { generatedErrors } = require("./middlewares/errors");

dotenv.config({ path: "./.env" });
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(logger("tiny"));

app.use(express.urlencoded({ extended: false }));

app.use("/user", user);
app.use("/admin", admin);

app.use("/business", business);
app.use("/address", address);

app.use("/category", categoryRoutes);
app.use("/product", productRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "Hello👋, From Server" });
});

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found`, 404));
});
app.use(generatedErrors);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on PORT:${process.env.PORT}`);
});
