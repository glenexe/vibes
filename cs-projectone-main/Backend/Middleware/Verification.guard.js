const User = require("../Model/user.model"); //importing the user model
const { UserError, AuthError } = require("../Errors/errors"); //importing the user error class
const { StatusCodes } = require("http-status-codes"); //importing the status codes
const jwt = require("jsonwebtoken"); //importing the jsonwebtoken library

class VerificationGuard {
  async emailVerifyGuard(req, res, next) {
    const { Email } = req.body; //destructuring the email from the request body
    const signingUser = await User.findByEmail(Email); //find the user by email
    if (!signingUser) {
      throw new UserError("User not found"); //if user is not found, throw an error
    }
    if (!signingUser.isUserVerified()) {
      throw new UserError("Email not verified", StatusCodes.UNAUTHORIZED); //if email is not verified, error
    }

    req.user = signingUser; //if user is found, assign the user to the request object
    next(); //call the next middleware
  }

  jwtVerifyGuard(req, res, next) {
    try {
      const { token } = req.cookies;
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET); //verify the token using the secret key

      const { userid } = verifiedToken;

      req.user = userid;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError("Token expired", StatusCodes.UNAUTHORIZED); //if token is expired, error
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError("Invalid token", StatusCodes.UNAUTHORIZED); //if token is invalid, error
      }
    }
  }

  async authorizeAdmin(req, res, next) {
    console.log("authorizeAdmin middleware hit");
    const userid = req.user;
    const user = await User.findById(userid);
    if (user.Role !== "Admin") {
      throw new AuthError("Unauthorized access", StatusCodes.FORBIDDEN); //if user is not admin, error
    }
    req.user = user; //if user is admin, assign the user to the request object
    next(); //if user is admin, call the next middleware
  }
}

module.exports = new VerificationGuard(); //exporting the class instance
