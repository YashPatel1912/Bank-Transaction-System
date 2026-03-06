const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../model/blacklist.model");

//*  authentication middleware
async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token is missing" });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    req.user = user;

    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token" });
  }
}

//* authentication middleware for system users
async function authSystemUserMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token is missing" });
  }

  const isBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId).select("+systemUser");
    if (!user.systemUser) {
      return res
        .status(403)
        .json({ message: "Forbidden access, user is not a system user" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized access, invalid token" });
  }
}

module.exports = {
  authMiddleware,
  authSystemUserMiddleware,
};
