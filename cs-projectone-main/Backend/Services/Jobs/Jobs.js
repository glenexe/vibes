const { User } = require("../../Model/user.model"); //importing the user model
const { schedule } = require("node-cron"); //importing the node-cron library
const { JobsError } = require("../../Errors/errors");
class Jobs {
  clearUnverifiedUsers() {
    schedule(
      "0 19 * * *",
      async () => {
        try {
          const currentDate = new Date();
          const expiredtime = new Date(
            currentDate.getTime() - 24 * 60 * 60 * 1000
          ); //subtracting 24 hours from the current date

          await User.deleteUnverifiedUsers(expiredtime); //deleting unverified users
          console.log("Unverified users deleted successfully"); //logging the success message
        } catch (error) {
          throw new JobsError(`JobsError:${error.message}`); //throwing an error if there is an issue
        }
      },
      {
        timezone: "Africa/Nairobi",
      }
    );
  }
}
module.exports = new Jobs();
