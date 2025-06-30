const express = require("express");
const router = express.Router();
const DisputeController = require("../Controllers/dispute.controller");
const jwtVerifyGuard = require("../Middleware/Verification.guard");
router.post(
  "/raisedispute/claim/:claimid/item/:itemid",
  DisputeController.RaiseDispute
);
router.get(
  "/getdisputes/:itemid",
  jwtVerifyGuard.authorizeAdmin,
  DisputeController.GetDisputes
);

router.patch(
  "/updatesingledispute/:disputeid/item/:itemid",
  jwtVerifyGuard.authorizeAdmin,
  DisputeController.UpdateSingleDispute
);

module.exports = router;
