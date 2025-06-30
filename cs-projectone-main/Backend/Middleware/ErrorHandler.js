const { StatusCodes } = require("http-status-codes");
class ErrorHandler {
  static HandleError(err, req, res, next) {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
  }
}
module.exports = ErrorHandler;
