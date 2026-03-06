const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const accountController = require("../controllers/account.controller");

const router = express.Router();

//* Create a new account for the authenticated user
router.post(
  "/",
  authMiddleware.authMiddleware,
  accountController.createAccountController,
);

//* Get all accounts for the authenticated user
router.get(
  "/",
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
);

//* Get the balance of a specific account for the authenticated user
router.get(
  "/balance/:accountId",
  authMiddleware.authMiddleware,
  accountController.getUserAccountBalanceController,
);

module.exports = router;
