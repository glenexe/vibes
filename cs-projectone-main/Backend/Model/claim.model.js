const mongoose = require("mongoose");
const { CustomError } = require("../Errors/errors");
const { StatusCodes } = require("http-status-codes");
const claimSchema = new mongoose.Schema(
  {
    Item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Status: {
      type: String,
      enum: ["approved", "rejected", "pending", "escalated"],
      default: "pending",
    },
    Reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Reviewed_Date: {
      type: Date,
      default: null,
    },
    Answers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Answer",
        },
      ],
    },
  },
  { timestamps: true }
);

claimSchema.statics.CreateClaim = async function (claimtocreate) {
  const claim = await this.create(claimtocreate);
  return claim;
};
claimSchema.statics.FindClaim = async function (claimquery, error) {
  const claim = await this.findOne(claimquery);
  if (!claim) {
    throw new CustomError(error.msg, error.status);
  }
  return claim;
};
claimSchema.statics.FindAllClaims = async function (claimquery) {
  const claims = await this.find(claimquery);
  return claims;
};
claimSchema.statics.FindIdAndUpdate = async function (claimid, claimquery) {
  return await this.findByIdAndUpdate(claimid, claimquery, {
    new: true,
    runValidators: true,
  });
};
const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
