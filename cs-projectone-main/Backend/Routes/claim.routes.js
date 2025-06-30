const express = require("express");
const ClaimController = require("../Controllers/claim.controller");
const VerificationGuard = require("../Middleware/Verification.guard");

const router = express.Router();

// method for  claiming an item
router.post("/claimitem/:Itemid", ClaimController.ClaimItem);

//method for viewing the claims made  to a particular item
router.get("/getclaims/:itemid", ClaimController.GetClaimsForItemFinder);

router.get(
  "/Admin/getclaims/:itemid",
  VerificationGuard.authorizeAdmin,
  ClaimController.GetEscalatedClaimsForItem
);

//method for reviewing the  claimed items by either admin or finder
router.patch("/reviewclaim/:Claimid/Item/:Itemid", ClaimController.ReviewClaim);

//viewing the current user's made claims with status pending,approved or rejected
router.get("/myclaims", ClaimController.GetMyClaims);

module.exports = router;
