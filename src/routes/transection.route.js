const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transectionController = require("../controllers/transection.controller");

const transectionRoutes = Router();

//* This route is for creating transection, only authenticated user can access this route
transectionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transectionController.createTransection,
);

//* This route is for creating initial fund transection, only system user can access this route
transectionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemUserMiddleware,
  transectionController.createInitialFundTransection,
);

module.exports = transectionRoutes;
