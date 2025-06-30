const express = require("express");
const router = express.Router();
const NotificationController = require("../Controllers/notifications.controller");

router.post("/createnotification", NotificationController.CreateNotification);
router.get("/getallNotifications", NotificationController.GetAllNotifications);
router.patch(
  "/markasRead/:notificationid",
  NotificationController.MarkNotificationAsRead
);

module.exports = router;
