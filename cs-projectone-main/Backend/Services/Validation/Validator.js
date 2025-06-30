const { StatusCodes } = require("http-status-codes");
const User = require("../../Model/user.model");
const { AuthError } = require("../../Errors/errors");
class Validator {
  //validate signup
  static async ValidateSignup(Fields) {
    //check if the fields are empty and throw an error if any field is empty
    await Validator.isFieldEmpty(Fields);

    // valid email
    Validator.isValidEmail(Fields.Email);
    await Validator.isEmailUnique(Fields.Email);

    //validate password
    Validator.isValidPassword(Fields.Password);
    // Validator.isPasswordMatch(Fields.Password, Fields.PasswordConfirmation);

    return true;
  }
  static async RemainingValidation(Fields) {
    //validate the remaining fields
    Validator.isValidName(Fields.Firstname);
    Validator.isValidName(Fields.Surname);
    Validator.isValidPhoneNumber(Fields.Phonenumber);
    return true;
  }
  //check if the email is unique in the database
  //if it is not unique, throw an error

  static async isEmailUnique(Email) {
    const existingUserEmail = await User.findByEmail(Email);
    if (existingUserEmail) {
      throw new AuthError("Email already exists", StatusCodes.CONFLICT);
    } else {
      return { message: "Email is unique" };
    }
  }

  //will be used to iterate over the fields and check if they are empty
  //and throw an error if any field is empty

  static isFieldEmpty(Fields) {
    Object.keys(Fields).forEach((key) => {
      if (Fields[key] === "") {
        throw new AuthError(`${key} is required`);
      }
    });
  }

  //check for valid email format
  static isValidEmail(Email) {
    const normalizedEmail = Email.toLowerCase().trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new AuthError("Invalid email format");
    }
  }
  static isValidPassword(Password) {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@%$#])[A-Za-z\d@%$#]{8,}$/;
    if (!passwordRegex.test(Password)) {
      throw new AuthError(
        "Password must be  8+ characters  at least one letter and one number"
      );
    }
    return true;
  }
  static isPasswordMatch(Password, PasswordConfirmation) {
    if (Password !== PasswordConfirmation) {
      throw new AuthError("Password does not match");
    }
  }
  static isValidName(name) {
    name = name.trim(); // Remove leading and trailing whitespace
    if (name.length < 2 || name.length > 10) {
      throw new AuthError("Name must be between 2 and 10 characters long");
    }
    const nameRegex = /^[A-Za-z]+$/; // Only letters are allowed
    if (!nameRegex.test(name)) {
      throw new AuthError(`${name} is not a valid name only letters`);
    }
    return true;
  }
  static isValidPhoneNumber(phoneNumber) {
    const kenyanMobileRegex = /^2547\d{8}$/;
    if (!kenyanMobileRegex.test(phoneNumber)) {
      throw new AuthError(
        "Please enter a valid Kenyan mobile number in the format 2547XXXXXXXX"
      );
    }
    return true;
  }
}

module.exports = Validator;
