const mongoose = require("mongoose");
const { DatabaseError } = require("../Errors/errors");
class ConnectDb {
  static async connect(url) {
    try {
      await mongoose.connect(url);
    } catch (error) {
      throw new DatabaseError(`Database connection failed:${error.message}`);
    }
  }
}
module.exports = ConnectDb;
