const jwt = require("jsonwebtoken");
class Jwtgenerator {
  static generateToken(userid) {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expiration time
    });
    return token;
  }
  static generateCookie(res, userid) {
    const token = this.generateToken(userid); // Generate the JWT token
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      samesite: "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // Cookie expiration time (2 days)
    });
  }
  static clearCookie(res) {
    res.cookie("token", "", { maxAge: 0 }); // Clear the cookie by setting its maxAge to 0
  }
}
module.exports = Jwtgenerator; // Export the class for use in other files
