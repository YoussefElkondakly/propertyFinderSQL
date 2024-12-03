const express = require("express");
const authController = require("./../controller/authController");
const agentController = require("./../controller/agentController");
const router = express.Router();
router.use(authController.protect, authController.accessManager("agent"));
router.get("/requests", agentController.getAllRequests);
router.post(
  "/makeAd",
  authController.isVerified,
  agentController.uploadImage,
  agentController.makeAd
);
router.get("/getMyAds", agentController.getMyAds);

router.use(authController.isVerified);
router.get("/getRequest/:requestId", agentController.getRequest);
router.get(
  "/getAd/:adId/matchRequest",
  //agentController.checkOwnerShip,
  agentController.matchRequest
);
router
  .route("/getAd/:adId")
  .get(
    //agentController.checkOwnerShip,

    agentController.getAd
  )
  .patch(
    //agentController.checkOwnerShip,
    agentController.uploadImage,
    agentController.checkBody
  )
  .delete(
    //agentController.checkOwnerShip,
    agentController.deleteAd
  );
module.exports = router;
