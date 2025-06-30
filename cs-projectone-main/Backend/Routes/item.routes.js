const express = require("express");
const router = express.Router();
const ItemController = require("../Controllers/item.controller");
const VerificationGuard = require("../Middleware/Verification.guard");

//uploading found  items  to the database
router.post("/uploadfounditem", ItemController.UploadFoundItem);

//get uploaded items with pending status

// approve uploaded item by admin
router.patch(
  "/Admin/approveuploadeditem/:Itemid",
  VerificationGuard.authorizeAdmin,
  ItemController.ApproveUploadedItem
);

//search for lost items
router.get("/searchfounditems", ItemController.SearchFoundItem);

//get all the items the founder has recovered
router.get("/getallfounderitems", ItemController.GetAllFounderItems);

// get all the items for the admin
router.get(
  "/getallitemsforadmin",
  VerificationGuard.authorizeAdmin,
  ItemController.AdminGetAllItems
);

router.patch("/escalateitem/:Itemid", ItemController.EscalateItem);
module.exports = router;
