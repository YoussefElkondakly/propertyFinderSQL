const express = require("express");
// const multer = require("multer");

const authController = require("./../controller/authController");
const router = express.Router();

//all of this routes happened without logging in
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyaccount/:verificationcode", authController.verifyAccount);
router.patch("/resetPassword/:code", authController.resetPassword);

module.exports = router;
