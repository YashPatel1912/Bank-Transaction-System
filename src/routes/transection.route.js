const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transectionController = require("../controllers/transection.controller");

const transectionRoutes = Router();

transectionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transectionController.createTransection,
);

transectionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemUserMiddleware,
  transectionController.createInitialFundTransection,
);

module.exports = transectionRoutes;
