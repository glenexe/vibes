const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    Questiontext: {
      type: String,
      required: true,
      trim: true,
    },
    Item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  },
  { timestamps: true }
);

questionSchema.statics.createQuestion = async function (questionToSave) {
  const question = await this.create(questionToSave);
  return question;
};
questionSchema.statics.FindQuestions = async function (
  verificationquestionquery
) {
  const questions = await this.find(verificationquestionquery);
  return questions;
};
const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
