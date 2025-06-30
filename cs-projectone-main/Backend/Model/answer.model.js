const mongoose = require("mongoose");
const answerSchema = new mongoose.Schema(
  {
    Answertext: {
      type: String,
      required: true,
      trim: true,
    },
    Claim_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
    },
    Question_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  },
  { timestamps: true }
);
answerSchema.statics.CreateAnswer = async function (answertosave) {
  return await this.create(answertosave);
};
const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
