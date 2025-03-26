var jwt = require("jsonwebtoken");
exports.generateTokens = (userId, isAdmin) => {
  {
    const accessToken = jwt.sign(
      { id: userId, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: userId, isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return { accessToken, refreshToken };
  }
};
