const accountModel = require("../model/account.model");

//* Create a new account for the authenticated user
async function createAccountController(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    message: "Account created successfully",
    account,
  });
}

//* Get all accounts for the authenticated user
async function getUserAccountsController(req, res) {
  const user = req.user;
  const accounts = await accountModel.find({ user: user._id });

  if (!accounts || accounts.length === 0) {
    return res.status(404).json({
      message: "No accounts found for the user",
    });
  }

  res.status(200).json({
    message: "Accounts retrieved successfully",
    accounts,
  });
}

//* Get the balance of a specific account for the authenticated user
async function getUserAccountBalanceController(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const balance = await account.getBalance();

  res.status(200).json({
    accountId: account._id,
    balance,
  });
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getUserAccountBalanceController,
};
