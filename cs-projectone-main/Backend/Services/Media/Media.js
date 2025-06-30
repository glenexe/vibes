require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");
const { CustomError } = require("../../Errors/errors"); // Importing CustomError for error handling

class MediaService {
  constructor() {
    // Initialize cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDNAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }
  async uploadImage(image) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(image); // Specify the folder where the image will be uploaded);
      const Imageurl = uploadResponse.secure_url; // Get the secure URL of the uploaded image
      return Imageurl;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new CustomError("Image upload failed", error.http_code);
    }
  }
  async deleteImage(imageurl) {
    try {
      return await cloudinary.uploader.destroy(
        imageurl.split("/").pop().split(".")[0]
      );
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw new CustomError("Image deletion failed");
    }
  }
}

module.exports = new MediaService(); // Exporting the instance of MediaService
