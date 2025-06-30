const axios = require("axios");
const CustomError = require("../Errors/Base.error"); // Importing the custom error class
class Fetchapi {
  static async Fetch(url, method, datainfo) {
    const config = {
      url,
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      baseURL: `http://127.0.0.1:5001`,
    };
    if (method !== "GET" && method !== "DELETE") {
      config.data = datainfo;
    }
    try {
      const { data } = await axios(config);
      return data;
    } catch (error) {
      if (error.response) {
        throw new CustomError(
          error.response.data.message,
          error.response.status
        );
      }
    }
  }

  static async TextVectorFetch(text) {
    return await this.Fetch("/text-vectorize", "POST", { text: text });
  }
}
module.exports = Fetchapi;
