const mongoose = require("mongoose");
const disputeSchema = new mongoose.Schema(
  {
    Raisedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Reason: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    Handledby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
    },
    Item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    ReviewedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

disputeSchema.statics.CreateDispute = async function (disputetobeRaised) {
  return await this.create(disputetobeRaised);
};

const Dispute = mongoose.model("Dispute", disputeSchema);

module.exports = Dispute;
