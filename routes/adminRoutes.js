const express = require("express");
const authController = require("./../controller/authController");
const adminController = require("./../controller/adminController");

const router = express.Router();
router.use(authController.protect, authController.accessManager("admin"));
router.get("/stats", adminController.getStats);
router.get("/requestsStats", adminController.getRequestsStats);

module.exports = router;
