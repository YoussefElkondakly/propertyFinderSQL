process.on("uncaughtException", (e) => console.log(e));
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const agentRoutes = require("./routes/agentRoutes");
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errController = require("./utils/errHandler");
const AppError = require("./utils/appError");
const relationShips = require("./utils/relationships");
// const {protect}=require('./controller/authController')

const app = express();
const baseUrl = "/matchingSystem/propertyFinder/";
app.use(baseUrl + "uploads/", express.static("uploads"));
app.use(express.json());

relationShips();
app.use(baseUrl + "auth", authRoutes);
app.use(baseUrl + "user", userRoutes);
app.use(baseUrl + "agent", agentRoutes);
app.use(baseUrl + "client", clientRoutes);
app.use(baseUrl + "admin", adminRoutes);

app.all("*", (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  next(err);
});
app.use(errController);
module.exports = app;
