const { StatusCodes } = require("http-status-codes");
const Notification = require("../Model/notification.model");
class NotificationController {
  async GetAllNotifications(req, res) {
    const currentuserid = req.user;
    const allnotifications = await Notification.find({
      to: currentuserid,
    }).sort({ createdAt: -1 });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Get all Notifications", data: allnotifications });
  }

  async MarkNotificationAsRead(req, res) {
    const { notificationid } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationid,
      { read: true },
      { new: true }
    );
    return res
      .status(StatusCodes.OK)
      .json({ msg: "updated", link: notification.link });
  }

  async CreateNotification(req, res) {
    const currentuserid = req.user;
    const { itemid, itemname, usertosend, message } = req.body;
    const notification = await Notification.create({
      from: currentuserid,
      to: usertosend,
      message,
      item: itemid,
    });
    res.status(StatusCodes.CREATED).json({ msg: "created notification" });
  }
}

module.exports = new NotificationController();
