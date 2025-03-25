exports.accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  expires: new Date(Date.now() + 15 * 60 * 1000),
};

exports.refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax",
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
};
