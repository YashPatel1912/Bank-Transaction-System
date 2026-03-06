const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth.route");
const accountRoutes = require("./routes/account.routes");
const transectionRoutes = require("./routes/transection.route");

// use routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transections", transectionRoutes);

module.exports = app;
