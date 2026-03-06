const transectionModel = require("../model/transection.model");
const ledgerModel = require("../model/ledger.model");
const accountModel = require("../model/account.model");
const emailService = require("../services/mail.service");

const mongoose = require("mongoose");

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransection(req, res) {
  // 1. Validate request
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      error: "FromAccount, ToAccount, Amount and IdempotencyKey are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({ _id: fromAccount });

  const toUserAccount = await accountModel.findOne({ _id: toAccount });

  if (!fromUserAccount || !toUserAccount) {
    return res
      .status(404)
      .json({ error: "FromAccount or ToAccount not found" });
  }

  // 2. validate idempotencyKey key
  const isTransectionExist = await transectionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransectionExist) {
    if (isTransectionExist.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transection already completed",
        transection: isTransectionExist,
      });
    }

    if (isTransectionExist.status === "PENDING") {
      return res.status(200).json({
        message: "Transection is still pending",
      });
    }

    if (isTransectionExist.status === "FAILED") {
      return res.status(500).json({
        message: "Transection processing failed, please try again",
      });
    }

    if (isTransectionExist.status === "REVERSED") {
      return res.status(500).json({
        message: "Transection was reversed, please try again",
      });
    }
  }

  // 3. Create Account Status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      error: "FromAccount or ToAccount is not active",
    });
  }

  // 4. Derive sender balance from ledger and validate
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`,
    });
  }

  let transection;
  try {
    // 5. Create Transection with PENDING status
    const session = await mongoose.startSession();
    session.startTransaction();

    transection = (
      await transectionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    // 6. Create Debit entry in ledger for sender
    const debitLedgerEntry = await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount: amount,
          transection: transection._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    await (() => {
      return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
    })();

    // 7. Create Credit entry in ledger for receiver
    const creditLedgerEntry = await ledgerModel.create(
      [
        {
          account: toAccount,
          amount: amount,
          transection: transection._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    // 8. Update(mark) Transection status to COMPLETED
    await transectionModel.findOneAndUpdate(
      { _id: transection._id },
      { status: "COMPLETED" },
      { session },
    );

    //  9. Commit mongodb session transaction
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    return res.status(400).json({
      message:
        "Transaction is Pending due to some issue, please retry after sometime",
    });
  }

  // 10. Send email notification to both sender and receiver
  await emailService.sendregistrationEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(200).json({
    message: "Transection completed successfully",
    transection,
  });
}

async function createInitialFundTransection(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      error: "ToAccount, Amount and IdempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findOne({ _id: toAccount });
  if (!toUserAccount) {
    return res.status(404).json({ error: "ToAccount not found" });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });
  if (!fromUserAccount) {
    return res.status(404).json({ error: "FromAccount not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transection = new transectionModel({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transection: transection._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transection: transection._id,
        type: "CREDIT",
      },
    ],
    { session },
  );

  transection.status = "COMPLETED";
  await transection.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transection,
  });
}

module.exports = {
  createTransection,
  createInitialFundTransection,
};
