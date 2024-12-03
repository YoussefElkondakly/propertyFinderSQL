const express = require("express");
const authController = require("./../controller/authController");
const clientController = require("./../controller/clientController");

const router = express.Router();
router.use(authController.protect, authController.accessManager("client"));
router.get("/getAds", clientController.getAds);
router.get("/getAds/:adId", clientController.getAd);
router.use(authController.isVerified);
router.get("/requests", clientController.getAllRequests);
router.post("/requests", clientController.postApropertyRequest);

router.get(
  "/requests/viewMatchAd/:requestId",
  clientController.checkOwnerShip,
  clientController.viewMatchAds
);
router.get(
  "/requests/:requestId",
  clientController.checkOwnerShip,
  clientController.getRequest
);
router.patch(
  "/requests/:requestId",
  clientController.checkOwnerShip,
  clientController.updateRequest
);
router.delete(
  "/requests/:requestId",
  clientController.checkOwnerShip,
  clientController.deleteRequest
);

//Will Make The one User Only Make one Request

module.exports = router;
