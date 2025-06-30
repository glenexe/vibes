const { StatusCodes } = require("http-status-codes");
const { UserError, ItemError, CustomError } = require("../Errors/errors");
const Item = require("../Model/item.model");
const Claim = require("../Model/claim.model");
const User = require("../Model/user.model");
const Answer = require("../Model/answer.model");
const Notification = require("../Model/notification.model");
const mongoose = require("mongoose");

class ClaimController {
  async ClaimItem(req, res) {
    const currentuserid = req.user;
    const { Itemid } = req.params;
    const { answers } = req.body;
    console.log(currentuserid, Itemid);

    //answers section
    if (!Array.isArray(answers) || answers.length === 0) {
      throw new CustomError(`Please provide answers`, StatusCodes.BAD_REQUEST);
    }

    const hasemptyAnswers = answers.some((answer) => !answer.Answertext);
    if (hasemptyAnswers) {
      throw new CustomError(
        `Atleast one answer is empty`,
        StatusCodes.BAD_REQUEST
      );
    }
    //check if the current userid is the one who uploaded the item to prevent him claiming
    const item = await Item.FindItem({ _id: Itemid });
    console.log(typeof item.Foundby, typeof currentuserid);

    if (item.isMatchingId(item.Foundby, currentuserid)) {
      throw new UserError(
        `Cannot claim what you found and posted`,
        StatusCodes.BAD_REQUEST
      );
    }
    const claimtocreate = await Claim.CreateClaim({
      Item: item._id,
      User: currentuserid,
    });

    await Item.findIdAndUpdate(Itemid, {
      $push: { Claims: claimtocreate._id },
    });

    const answerpromise = answers.map((answer) => {
      return Answer.CreateAnswer({ ...answer, Claim_id: claimtocreate._id });
    });
    const answerdocuments = await Promise.all(answerpromise);
    const answerdocumentsid = answerdocuments.map((singleanswerdocument) => {
      return singleanswerdocument._id;
    });

    await Claim.FindIdAndUpdate(claimtocreate._id, {
      $push: { Answers: { $each: answerdocumentsid } },
    });

    //finally send notification to finder about claim
    await Notification.create({
      to: item.Foundby,
      message: `A claim has been raised for Item ${item.ItemName}`,
      type: "claim",
      link: `/finder/item/${item._id}`,
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: `claimed successfully` });
  }

  async GetClaimsForItemFinder(req, res) {
    const currentuserid = req.user;
    const { itemid } = req.params;
    const itemresults = await ClaimController.getClaimsGroupedByItem({
      forUserId: currentuserid,
      itemid,
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Claims retrieved successfully", data: itemresults });
  }

  async GetEscalatedClaimsForItem(req, res) {
    const { itemid } = req.params;
    const itemresults = await ClaimController.getClaimsGroupedByItem({
      onlyEscalated: true,
      itemid,
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Claims retrieved successfully", data: itemresults });
  }

  async ReviewClaim(req, res) {
    const currentuserid = req.user;
    const { Claimid, Itemid } = req.params;
    const { Status } = req.body;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Get current user with session
      const currentuser = await User.findOne({ _id: currentuserid }).session(
        session
      );
      if (!currentuser) {
        throw new UserError("User not found", StatusCodes.NOT_FOUND);
      }

      const admin = currentuser.Role === "Admin";

      // Get claim with session
      const claim = await Claim.findOne({ _id: Claimid }).session(session);
      if (!claim) {
        throw new UserError("Claim does not exist", StatusCodes.NOT_FOUND);
      }

      // Get item with session
      const item = await Item.findOne({ _id: Itemid }).session(session);
      if (!item) {
        throw new UserError("Item does not exist", StatusCodes.NOT_FOUND);
      }

      // Authorization checks
      if (item.isEscalated && !admin) {
        throw new UserError(
          "Only admin can review escalated items",
          StatusCodes.FORBIDDEN
        );
      }

      if (!item.isMatchingId(item.Foundby.toString(), currentuserid)) {
        throw new UserError(
          "You are not the founder of this item hence cannot review",
          StatusCodes.FORBIDDEN
        );
      }

      if (Status === "approved") {
        // Update claim - pass session in options
        await Claim.findByIdAndUpdate(
          Claimid,
          {
            Status,
            Reviewed_by: currentuserid,
            Reviewed_Date: new Date(),
          },
          { session }
        );

        // Create notification - pass session in options
        await Notification.create(
          [
            {
              to: claim.User, // Make sure this is just the ID, not the session
              message: `Congratulations! Your claim for ${item.ItemName} has been approved.`,
              type: "claim",
              link: "/myclaims",
            },
          ],
          { session }
        );

        // Find and reject other claims
        const rejectedclaims = await Claim.find({
          _id: { $ne: Claimid },
          Item: Itemid,
          Status: "pending",
        }).session(session);

        if (rejectedclaims.length > 0) {
          await Claim.updateMany(
            {
              _id: { $ne: Claimid },
              Item: Itemid,
              Status: "pending",
            },
            {
              $set: {
                Status: "rejected",
                Reviewed_by: currentuserid,
                Reviewed_Date: new Date(),
              },
            },
            { session }
          );

          // Create rejection notifications
          const rejectNotifications = rejectedclaims.map((c) => ({
            to: c.User, // Just the ID
            message: `Your claim for ${item.ItemName} was rejected.`,
            type: "claim",
            link: "/myclaims",
          }));

          await Notification.insertMany(rejectNotifications, { session });
        }
      } else if (Status === "rejected") {
        await Claim.findByIdAndUpdate(
          Claimid,
          {
            Status,
            Reviewed_by: currentuserid,
            Reviewed_Date: new Date(),
          },
          { session }
        );

        await Notification.create(
          [
            {
              to: claim.User, // Just the ID
              message: `Your claim for ${item.ItemName} was rejected. Please follow up with our office`,
              type: "claim",
              link: "/myclaims",
            },
          ],
          { session }
        );
      }

      await session.commitTransaction();
      return res.status(StatusCodes.OK).json({
        message: "Claim reviewed successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Failed to review claim",
      });
    } finally {
      session.endSession();
    }
  }

  async GetMyClaims(req, res) {
    const currentuserid = req.user;
    console.log(currentuserid);
    const { Status } = req.query;
    console.log(`Current status:${Status}`);
    let queryobject = {};
    if (Status && Status !== "All") {
      queryobject.Status = Status;
    }

    if (Status) {
      queryobject.Status = Status;
    }
    const userclaims = await Claim.find({
      ...queryobject,
      User: currentuserid,
    })
      .populate({
        path: "Item",
        select: "ItemName _id Imageurl Status",
      })
      .populate({
        path: "Answers",
        select: "Question_id Answertext",
        populate: {
          path: "Question_id",
          select: "Questiontext",
        },
      });
    return res
      .status(StatusCodes.OK)
      .json({ message: "My claims retrieved successfully", data: userclaims });
  }

  // Helper function
  static async getClaimsGroupedByItem({
    forUserId = null,
    onlyEscalated = false,
    itemid,
  }) {
    const itemFilter = {};
    if (forUserId) itemFilter.Foundby = forUserId;
    if (onlyEscalated) itemFilter.isEscalated = true;

    const items = await Item.findOne({ ...itemFilter, _id: itemid })
      .select(
        "ItemName Description Category Imageurl Locationfound createdAt Status Claims isEscalated"
      )
      .populate({
        path: "Claims",
        options: { sort: { createdAt: -1 } },
        select: "_id User Status Answers",
        populate: [
          {
            path: "User",
            select: "Email ProfileImg Firstname Surname",
          },
          {
            path: "Answers",
            select: "Question_id Answertext",
            populate: {
              path: "Question_id",
              select: "Questiontext",
            },
          },
        ],
      });
    return items;
  }
}
module.exports = new ClaimController();
