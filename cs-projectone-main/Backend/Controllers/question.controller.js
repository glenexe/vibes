const { StatusCodes } = require("http-status-codes");
const Item = require("../Model/item.model");
const Question = require("../Model/question.model");
const Claim = require("../Model/claim.model");
const { UserError, CustomError, ItemError } = require("../Errors/errors");

class QuestionController {
  async UploadVerificationQuestion(req, res) {
    console.log("upload verification question endpoint hit.....");
    const currentuserid = req.user;
    const { Itemid } = req.params;
    const { Questions } = req.body;

    // console.log(Questions);

    const item = await Item.FindItem({
      _id: Itemid,
      Status: "approved",
      /* isVerificationQuestionSet: false,*/
    });

    if (!item.isMatchingId(item.Foundby, currentuserid)) {
      throw new UserError(
        ` Your are not the founder of this item`,
        StatusCodes.BAD_REQUEST
      );
    }

    //create the question
    const questionpromises = Questions.map((question) => {
      return Question.createQuestion({
        Questiontext: question,
        Item: item._id,
      });
    });
    const questiondocuments = await Promise.all(questionpromises);
    const questionids = questiondocuments.map((singlequestion) => {
      return singlequestion._id;
    });

    //update the item field to reflect the new cahnges
    await Item.findIdAndUpdate(Itemid, {
      $set: { isVerificationQuestionSet: true },
      $push: { Questions: { $each: questionids } },
    });
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "questions uploaded successfully" });
  }

  async GetVerificationQuestions(req, res) {
    const { Itemid } = req.params;

    console.log(Itemid);

    const item = await Item.findById(Itemid)
      .select(
        "_id ItemName Category Description Imageurl Locationfound Questions createdAt"
      )
      .populate("Questions");

    console.log(item);
    return res
      .status(StatusCodes.OK)
      .json({ message: "questions retrieved successfully", item });
  }
}
module.exports = new QuestionController();
