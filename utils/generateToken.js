var jwt = require("jsonwebtoken");
exports.generateTokens = (user, role) => {
  {
    const accessToken = jwt.sign({ user, role }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ user, role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }
};
