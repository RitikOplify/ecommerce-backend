const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const ErrorHandler = require("./utils/errorHandler");
const admin = require("./routes/adminRoute");
const dealer = require("./routes/dealersRoutes");
const { generatedErrors } = require("./middlewares/errors");

dotenv.config({ path: "./.env" });
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(logger("tiny"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use("/admin", admin);
app.use("/dealer", dealer);

app.get("/", (req, res) => {
  res.json("Hello👋, From Server");
});

app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Requested URL Not Found`, 404));
});
app.use(generatedErrors);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on PORT:${process.env.PORT}`);
});
