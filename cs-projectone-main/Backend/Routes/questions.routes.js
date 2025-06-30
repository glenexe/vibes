const express = require("express");
const QuestionController = require("../Controllers/question.controller");
const router = express.Router();

// formulating questions for items
router.post(
  "/uploadverificationquestion/:Itemid",
  QuestionController.UploadVerificationQuestion
);

// sending the questions to the claimants for an answer
router.get(
  "/getverificationquestions/Item/:Itemid",
  QuestionController.GetVerificationQuestions
);

module.exports = router;
