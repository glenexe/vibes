const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { StatusCodes } = require("http-status-codes");
const { AuthError, UserError } = require("../Errors/errors");
const userSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Firstname: {
      type: String,
      trim: true,
    },
    Surname: {
      type: String,
      trim: true,
    },
    ProfileImg: {
      type: String,
      default: "",
    },
    Phonenumber: {
      type: String,
      default: "",
    },
    Role: {
      type: String,
      default: "Student",
      enum: ["Admin", "Student", "Staff"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      default: "",
    },
    verificationCodeExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

//Build a query builder in the future

//method to find if  an email exists in the database

userSchema.statics.findByEmail = async function (Email) {
  return await this.findOne({ Email });
};

userSchema.statics.findById = async function (id) {
  const user = await this.findOne({ _id: id });
  if (!user) {
    throw new UserError("User not found"); //throwing an error if the user is not found
  }
  return user;
};

// before we creating our user a function to hash the password

userSchema.pre("save", async function (next) {
  if (this.isModified("Password")) {
    const salt = await bcrypt.genSalt(10); //generating a salt
    this.Password = await bcrypt.hash(this.Password, salt); //hashing the password with the salt
  }
  next(); //calling the next middleware
});

//method to compare the password with the hashed password

userSchema.methods.comparePassword = async function (Password) {
  return await bcrypt.compare(Password, this.Password);
  //comparing the password with the hashed password
};

//method to create a new user

userSchema.statics.CreateUser = async function (Email, Password) {
  const user = await this.create({ Email, Password }); //creating a new user
  if (!user) {
    throw new AuthError("User not created", StatusCodes.INTERNAL_SERVER_ERROR); //throwing an error if the user is not created
  }

  return user; //returning the user
};

//method to generate a verification code

userSchema.methods.generateVerificationCode = function () {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString(); //generating a random 6 digit number
  this.verificationCode = verificationCode; //setting the verification code to the user
  return verificationCode; //returning the verification code
};

//generate a verification code expiry time
userSchema.methods.generateVerificationCodeExpiry = function () {
  const currentTime = new Date(); //getting the current time
  const expiryTime = new Date(currentTime.getTime() + 10 * 60000); //setting the expiry time to 10 minutes from now
  this.verificationCodeExpiry = expiryTime; //setting the expiry time to the user
  return expiryTime; //returning the expiry time
};

//check if verification code is valid

userSchema.methods.isVerificationCodeValid = function (verificationcode) {
  return this.verificationCode === verificationcode.trim(); //checking if the verification code is valid
};

//method to check if code  has expired
userSchema.methods.isVerificationCodeExpired = function () {
  const currentTime = new Date();
  return this.verificationCodeExpiry < currentTime;
};

//method to update the isEmailVerified field to true

userSchema.methods.updateisEmailVerified = async function (verificationCode) {
  const iscodeexpired = this.isVerificationCodeExpired(); //checking if the verification code has expired

  if (iscodeexpired) {
    this.verificationCode = ""; //setting the verification code to empty string
    this.verificationCodeExpiry = null; //setting the verification code expiry to null
    await this.save(); //saving our modifications
    throw new AuthError("Verification code expired", StatusCodes.BAD_REQUEST); //throwing an error if the verification code has expired
  }

  const iscodevalid = this.isVerificationCodeValid(verificationCode); //checking if the verification code is valid
  if (!iscodevalid) {
    throw new AuthError("Invalid verification code", StatusCodes.BAD_REQUEST); //throwing an error if the verification code is invalid
  }

  this.isEmailVerified = true; //setting the isEmailVerified field to true
  this.verificationCode = ""; //setting the verification code to empty string
  this.verificationCodeExpiry = null; //setting the verification code expiry to null
  await this.save(); //saving our modifications
};

//method to check if the user is verified
userSchema.methods.isUserVerified = function () {
  return this.isEmailVerified;
};
userSchema.methods.updateRole = async function (role) {
  this.Role = role;
  await this.save();
};

//method to delete unverified users
userSchema.statics.deleteUnverifiedUsers = async function (expiredTime) {
  const result = await this.deleteMany({
    isEmailVerified: false,
    verificationCodeExpiry: { $lt: expiredTime },
  });

  if (result.deletedCount > 0) {
    console.log(`${result.deletedCount} unverified users deleted successfully`);
  } else {
    console.log("No unverified users found to delete");
  }
};

userSchema.statics.FindAdmin = async function () {
  const Admins = await this.find({ Role: "Admin" });
  return Admins;
};
const User = mongoose.model("User", userSchema); //creating a model using the schema
module.exports = User; //exporting the model
