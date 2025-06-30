const { StatusCodes } = require("http-status-codes");
const Dispute = require("../Model/dispute.model");
const Claim = require("../Model/claim.model");
const { CustomError, ItemError, UserError } = require("../Errors/errors");
const Item = require("../Model/item.model");
const mongoose = require("mongoose");
const Notification = require("../Model/notification.model");
const User = require("../Model/user.model");
class DisputeController {
  async RaiseDispute(req, res) {
    const currentuserid = req.user;
    console.log(currentuserid);
    const { claimid, itemid } = req.params;
    const { Reason } = req.body;
    console.log(claimid, itemid);
    const claim = await Claim.FindClaim(
      { _id: claimid, User: currentuserid },
      { msg: "Claim does not exist", status: StatusCodes.NOT_FOUND }
    );
    const item = await Item.FindItem({ _id: itemid });
    if (!item) {
      throw new ItemError("Item does not exist");
    }
    if (claim.Status !== "rejected") {
      throw new UserError(
        "Claim status not rejected thereby cant raise dsipute",
        StatusCodes.FORBIDDEN
      );
    }
    const dispute = {
      Raisedby: currentuserid,
      Reason,
      Claim: claim._id,
      Item: item._id,
    };
    const createdDispute = await Dispute.CreateDispute(dispute);
    await Item.findByIdAndUpdate(itemid, {
      $push: { Disputes: createdDispute._id },
    });
    const Admins = await User.FindAdmin();
    const notifications = Admins.map((Admin) => ({
      to: Admin._id,
      type: "item",
      message: `A dispute has been raised for "${item.ItemName}"  and requires your attention`,
      item: itemid,
      from: null,
    }));
    // send the notifications to admin
    await Notification.insertMany(notifications);

    return res.status(StatusCodes.CREATED).json({ message: "dispute raised" });
  }
  async GetDisputes(req, res) {
    const { itemid } = req.params;
    const itemwithDisputes = await Item.findOne({ _id: itemid })
      .where("Disputes")
      .ne([])
      .select("ItemName  Imageurl Foundby Claims Disputes")
      .populate([
        {
          path: "Foundby",
          select: "Email ProfileImg Firstname Surname",
        },

        {
          path: "Claims",
          select: "User Status Reviewed_by",
          populate: [
            {
              path: "User",
              select: "Email ProfileImg Firstname Surname",
            },
            {
              path: "Reviewed_by",
              select: "Email ProfileImg Firstname Surname",
            },
          ],
        },
        {
          path: "Disputes",
          select: "Raisedby Reason Handledby",
          populate: [
            {
              path: "Raisedby",
              select: "Email ProfileImg Firstname Surname",
            },
            {
              path: "Handledby",
              select: "Email ProfileImg Firstname Surname",
            },
          ],
        },
      ]);
    return res.status(200).json(itemwithDisputes);
  }

  async UpdateSingleDispute(req, res) {
    const currentuserid = req.user._id;
    const { itemid, disputeid } = req.params;
    const { Status } = req.body;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const Resolveddispute = await Dispute.findByIdAndUpdate(
        disputeid,
        {
          Item: itemid,
          Status,
        },
        { session }
      );
      const otherDisputes = await Dispute.find({
        _id: { $ne: Resolveddispute },
        Item: itemid,
        Status: "pending",
      });
      if (otherDisputes.length > 0) {
        await Dispute.updateMany(
          {
            _id: { $ne: Resolveddispute },
            Item: itemid,
            Status: "pending",
          },
          {
            $set: {
              Status: "resolved",
              Handledby: currentuserid,
              Reviewed_Date: new Date(),
            },
          },

          { session }
        );
      }
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new CustomError(error.message);
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "Updated Individual dispute" });
  }
}
module.exports = new DisputeController();
