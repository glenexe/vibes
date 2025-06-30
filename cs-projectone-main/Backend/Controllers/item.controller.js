const User = require("../Model/user.model"); //importing the user model

const MediaService = require("../Services/Media/Media.js"); //importing the media service for handling image uploads

const Item = require("../Model/item.model");
const Notification = require("../Model/notification.model.js");

const { StatusCodes } = require("http-status-codes");
const Fetchapi = require("../Utils/Axios.js"); //importing the fetch api utility for making external requests
const { ItemError } = require("../Errors/errors.js");
const mongoose = require("mongoose");

class ItemController {
  async UploadFoundItem(req, res) {
    const currentuserid = req.user; //get the user id from the request object
    const { ItemName, Category, Description, Imageurl, Locationfound } =
      req.body; //get the item details from the body
    if (!ItemName || !Category || !Description || !Imageurl || !Locationfound) {
      throw new ItemError("All fields are required", StatusCodes.BAD_REQUEST);
    }
    const user = await User.findOne({ _id: currentuserid }); //check if the user exists and select the id field
    const itemtosave = {
      ItemName,
      Category,
      Description,
      Imageurl,
      Locationfound,
      Foundby: user._id, //set the user id to the item
    };
    const itemcreated = await Item.CreateItem(itemtosave); //create the item using the user model
    // send a notification to the Admin for Item approval
    const Admins = await User.FindAdmin();
    const notifications = Admins.map((Admin) => ({
      to: Admin._id,
      type: "item",
      message: `A new item "${ItemName}" was uploaded by ${user.Firstname} and awaits approval.`,
      item: itemcreated._id,
      from: null,
    }));
    // send the notifications to admin
    await Notification.insertMany(notifications);

    console.log(itemcreated); //log the created item
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Item uploaded awaiting approval" });
  }

  async GetAllFounderItems(req, res) {
    const currentuserid = req.user;
    const { Status } = req.query;

    let queryObject = {};
    if (Status) {
      queryObject.Status = Status;
    }
    const FounderItems = await Item.find({
      Foundby: currentuserid,
      ...queryObject,
    })
      .select(
        "ItemName Category Imageurl Description Locationfound createdAt Status"
      )
      .sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ message: "my uploaded Items", data: FounderItems });
  }

  async ApproveUploadedItem(req, res) {
    try {
      const currentAdminuser = req.user._id;
      const { Itemid } = req.params; //get the item id from the request parameters
      const { Status } = req.body; //get the status from the body

      const item = await Item.findIdAndUpdate(Itemid, {
        Status,
        ReviewedBy: currentAdminuser,
        ReviewedAt: new Date(),
      }); //update the item with the new status and approved by user

      if (item.Status !== "approved") {
        // Send a notification to the user who uploaded the item the reason for rejection and next course of action
        const notification = await Notification.create({
          to: item.Foundby,
          message: `Your item ${item.ItemName} was rejected. Please follow up with our office`,
          link: `/finder/item/${item._id}`,
        });
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Item not approved" });
      }

      //upload the image to cloudinary and get the image url
      const Imageurl = await MediaService.uploadImage(item.Imageurl);

      //Send the image url to the python microservice for vectorization
      const { vector } = await Fetchapi.Fetch("/vectorize", "POST", {
        Imageurl,
      });
      console.log(Imageurl, vector); //log the response from the python microservice

      //update the item with the image url and vector data
      await Item.findByIdAndUpdate(Itemid, {
        Imageurl,
        Vector: vector, //assuming the python service returns vector data
      });

      // send a notification to the client that the item has been approved
      const notification = await Notification.create({
        from: currentAdminuser._id,
        to: item.Foundby,
        message: `Your item ${item.ItemName} was successfully uploaded`,
        link: `finder/item/${item._id}`,
      });
      return res
        .status(200)
        .json({ message: "Approve Uploaded Item endpoint hit" });
    } catch (error) {
      console.log("error in ApproveUploadedItem:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
  async SearchFoundItem(req, res) {
    const { ItemName, Category, Description } = req.query;
    let results = [];

    // Case 1: Vector search by ItemName
    if (ItemName) {
      const { vector } = await Fetchapi.TextVectorFetch(ItemName);
      results = await Item.searchVector(vector); // e.g. your Pinecone, Weaviate, etc.

      // Optional: filter by category if selected
      if (Category && Category !== "AllCategories") {
        results = results.filter((item) => item.Category === Category);
      }

      return res.status(200).json({
        msg: "Search by ItemName",
        data: results,
      });
    }

    // Case 2: Vector search by Description
    if (Description) {
      const { vector } = await Fetchapi.TextVectorFetch(Description);
      results = await Item.searchVector(vector);

      if (Category && Category !== "AllCategories") {
        results = results.filter((item) => item.Category === Category);
      }

      return res.status(200).json({
        msg: "Search by Description",
        data: results,
      });
    }

    // Case 3: No vector search, just Category or all items
    const filter = {
      isVerificationQuestionSet: true,
      Status: "approved",
    };

    if (Category && Category !== "AllCategories") {
      filter.Category = Category;
    }

    const items = await Item.find(filter)
      .select("ItemName Category Imageurl Description Locationfound createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      msg: "Filtered by category or all items",
      data: items,
    });
  }

  async AdminGetAllItems(req, res) {
    const { isEscalated, Status } = req.query;
    let queryObject = {};
    if (isEscalated === "true") {
      queryObject.isEscalated = true;
    }
    if (Status) {
      queryObject.Status = Status;
    }
    const Items = await Item.find(queryObject);
    res.status(StatusCodes.OK).json({
      message: "All items for admin",
      data: Items,
    });
  }

  async EscalateItem(req, res) {
    const currentuserid = req.user;
    const { Itemid } = req.params;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const item = await Item.findOne({ _id: Itemid }).session(session);
      if (!item) throw new UserError("Item not found", 404);

      if (!item.isMatchingId(item.Foundby, currentuserid)) {
        throw new UserError("You cannot escalate this item", 403);
      }

      if (item.isEscalated) {
        throw new UserError("This item is already escalated", 400);
      }

      await Item.findByIdAndUpdate(
        Itemid,
        { isEscalated: true },
        { session, runValidators: true }
      );

      const admins = await User.find({ Role: "Admin" }).session(session);
      const notifications = admins.map((admin) => ({
        to: admin._id,
        message: `Item "${item.ItemName}" has been escalated.`,
        type: "item",
        item: item._id,
      }));

      await Notification.insertMany(notifications, { session });

      await session.commitTransaction();
      return res.status(200).json({ message: "Item escalated successfully." });
    } catch (err) {
      await session.abortTransaction();
      return res.status(err.statusCode || 500).json({
        message: err.message || "Failed to escalate item",
      });
    } finally {
      session.endSession();
    }
  }
}

module.exports = new ItemController();
