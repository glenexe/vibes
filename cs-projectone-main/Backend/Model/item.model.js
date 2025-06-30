const mongoose = require("mongoose");
const { ItemError } = require("../Errors/errors"); //importing the item error class
const itemSchema = new mongoose.Schema(
  {
    ItemName: {
      type: String,
      required: true,
      trim: true,
    },
    Category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Clothing",
        "Books",
        "Accessories",
        "Other",
        "ID-cards",
      ],
    },
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    Imageurl: {
      type: String,
      required: true,
      trim: true,
    },
    Foundby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Locationfound: {
      type: String,
      required: true,
      trim: true,
    },
    Status: {
      type: String,
      enum: ["pending", "approved", "rejected", "returned"],
      default: "pending",
    },
    ReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ReviewedAt: {
      type: Date,
      default: null,
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },

    Vector: {
      type: [Number],
      required: true,
    },
    isVerificationQuestionSet: {
      type: Boolean,
      default: false,
    },
    Questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
      ],
      default: [],
    },
    Claims: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Claim",
        },
      ],
    },
    Disputes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dispute",
        },
      ],
    },
  },
  { timestamps: true }
);

itemSchema.statics.CreateItem = async function (itemtosave) {
  const item = await this.create(itemtosave);
  return item;
};
itemSchema.statics.FindItem = async function (query) {
  const item = await this.findOne(query);
  return item;
};

itemSchema.methods.isMatchingId = function (firstid, secondid) {
  return firstid.toString().trim() === secondid.toString().trim();
};
itemSchema.statics.GetPendingItems = async function () {
  const items = await this.find({ Status: "pending" });
  return items;
};
itemSchema.statics.findIdAndUpdate = async function (itemid, updateData) {
  const item = await this.findByIdAndUpdate(itemid, updateData, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw new ItemError("Item not found");
  }
  return item;
};

itemSchema.statics.searchVector = async function (textvector, k = 1) {
  const results = await this.aggregate([
    {
      $vectorSearch: {
        index: "Vector_Search",
        path: "Vector",
        queryVector: textvector,
        limit: k,
        numCandidates: 100,
      },
    },
    {
      $match: { Status: "approved", isVerificationQuestionSet: true },
    },
    {
      $addFields: {
        score: { $meta: "searchScore" }, // Optional: Attach relevance score
      },
    },
    {
      $project: {
        ItemName: 1,
        Category: 1,
        Imageurl: 1,
        Locationfound: 1,
        createdAt: 1,
        Status: 1,
        Foundby: 1,
        score: 1, // Include this only if you need relevance
      },
    },
  ]);
  return results;
};

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
