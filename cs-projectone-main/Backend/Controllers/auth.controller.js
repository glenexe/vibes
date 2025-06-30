//importing the email validator class
const Validator = require("../Services/Validation/Validator");
const User = require("../Model/user.model");
const Mail = require("../Services/Mail/Mail");
const { StatusCodes } = require("http-status-codes");
const { UserError } = require("../Errors/errors");
const { AuthError } = require("../Errors/errors");
const Jwtgenerator = require("../Utils/Jwt.generator");
const MediaService = require("../Services/Media/Media");
class AuthController {
  // Logic for login
  async Login(req, res) {
    const { Email, Password } = req.body; //get the email and password from the body
    console.log(req.body);
    const user = await User.findOne({ Email });
    const isPasswordCorrect = user && (await user.comparePassword(Password)); //compare the password with the hashed password
    if (!user || !isPasswordCorrect) {
      throw new AuthError("Invalid credentials"); //if the user is not found or the password is incorrect, throw an error
    }
    //generate a jwt token and send it to the user
    const userid = user._id.toString(); //get the user id
    Jwtgenerator.generateCookie(res, userid);
    const Authuser = {
      _id: user._id,
      Email: user.Email,
      Firstname: user.Firstname,
      Surname: user.Surname,
      Phonenumber: user.Phonenumber,
      ProfileImg: user.ProfileImg,
    }; //create an object with the user information
    return res.status(200).json({ message: "Login successful", Authuser });
  }

  // Logic for signup
  async StartSignup(req, res) {
    const { Email, Password } = req.body;

    await Validator.ValidateSignup({ Email, Password }); //validation logic
    const user = await User.CreateUser(Email, Password); //creating a new user

    //generate a verification code and  link  send it to user email
    const verificationCode = await user.generateVerificationCode();
    user.verificationCode = verificationCode; //set the verification code to the user
    const expiryTime = user.generateVerificationCodeExpiry();
    console.log(
      expiryTime.toLocaleString("en-KE", { timezone: "Africa/Nairobi" })
    );

    await user.save(); //save the user to the database

    //send the email to the user
    await Mail.sendMail(
      user.Email,
      "VerificationCode",
      verificationCode,
      "verification"
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "Registration successful", email: user.Email });
  }

  // Logic for verification
  async Verification(req, res) {
    const { Email, verificationcode } = req.body; //get the email from the body

    console.log(req.body);
    //find the user by email
    const user = await User.findByEmail(Email);
    if (!user) {
      throw new UserError("User not found"); //if user is not found, throw an error
    }

    //check if the verification code is valid
    //get the verification code from the params
    console.log(verificationcode);
    await user.updateisEmailVerified(verificationcode);

    return res
      .status(StatusCodes.OK)
      .json({ message: "Verification successful" });
  }

  // Logic for collecting profile information
  async CollectProfileInfo(req, res) {
    const signingUser = req.user; //get the user from the request object
    const { Firstname, Surname, Phonenumber } = req.body; //get the profile info from the body
    console.log(req.body);
    await Validator.RemainingValidation({ Firstname, Surname, Phonenumber }); //validation logic

    //validating the second stage of signup after email verification

    signingUser.Firstname = Firstname;
    signingUser.Surname = Surname;
    signingUser.Phonenumber = Phonenumber;
    await signingUser.save();

    return res.status(StatusCodes.OK).json({ message: "Successful Signup" });
  }

  // Logic for logout
  async Logout(req, res) {
    Jwtgenerator.clearCookie(res); //clear the cookie
    return res.status(200).json({ message: "Logout successful" });
  }

  // update profile
  async UpdateProfile(req, res) {
    const currentuserid = req.user;
    console.log(currentuserid);
    const user = await User.findById(currentuserid);
    const { Firstname, Surname, Phonenumber, Password, OldPassword } = req.body;
    console.log(req.body);
    if (Firstname && Validator.isValidName(Firstname)) {
      user.Firstname = Firstname;
    }
    if (Surname && Validator.isValidName(Surname)) {
      user.Surname = Surname;
    }
    if (Phonenumber && Validator.isValidPhoneNumber(Phonenumber)) {
      user.Phonenumber = Phonenumber;
    }
    if (Password || OldPassword) {
      if (!OldPassword || !OldPassword) {
        throw new Customerror(
          `Please provide both old and updated password`,
          StatusCodes.BAD_REQUEST
        );
      } else {
        console.log("Entering password update logic...");
        const isPasswordCorrect = await user.comparePassword(OldPassword);
        console.log(`Ispasswordcorrect ${isPasswordCorrect}`);
        if (!isPasswordCorrect) {
          throw new AuthError(
            `Incorrect password.You cant reset your passwword`
          );
        }
        if (Validator.isValidPassword(Password)) {
          user.Password = Password;
        }
      }
    }
    await user.save();
    const updatedAuthuser = {
      _id: user._id,
      Email: user.Email,
      Firstname: user.Firstname,
      Surname: user.Surname,
      Phonenumber: user.Phonenumber,
      ProfileImg: user.ProfileImg,
    };
    return res
      .status(StatusCodes.OK)
      .json({ message: "Update successfuly", updatedAuthuser });
  }

  async UpdateProfileImage(req, res) {
    const currentuserid = req.user;
    const user = await User.findOne({ _id: currentuserid });
    const { ProfileImg } = req.body;
    if (ProfileImg) {
      if (user.ProfileImg) {
        await MediaService.deleteImage(user.ProfileImg);
      }
      const newprofileurl = await MediaService.uploadImage(ProfileImg);
      user.ProfileImg = newprofileurl;
      await user.save();
      return res.status(StatusCodes.OK).json({
        msg: "profile updated successfully",
        ProfileImg: user.ProfileImg,
      });
    }
  }
  async GetProfile(req, res) {
    const currentuserid = req.user;
    const user = await User.findOne({ _id: currentuserid }).select(
      "Email Firstname Surname Phonenumber ProfileImg"
    );
    if (!user) {
      throw new UserError("User not found");
    }
    S;
    return res.status(StatusCodes.OK).json(user);
  }
}

module.exports = new AuthController();
