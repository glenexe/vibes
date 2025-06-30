const { StatusCodes } = require("http-status-codes");
const BaseError = require("./Base.error");
class AuthError extends BaseError {
  constructor(message, statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode);
  }
}
class DatabaseError extends BaseError {
  constructor(message) {
    super(message);
  }
}
class UserError extends BaseError {
  constructor(message, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}
class JobsError extends BaseError {
  constructor(message) {
    super(message);
  }
}
class ItemError extends BaseError {
  constructor(message, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}
class CustomError extends BaseError {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}
module.exports = {
  AuthError,
  DatabaseError,
  UserError,
  JobsError,
  ItemError,
  CustomError,
};
