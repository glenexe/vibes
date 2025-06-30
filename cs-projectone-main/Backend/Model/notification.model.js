const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["claim", "system", "message", "item", "dispute"],
      default: "message",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const Notifications = mongoose.model("Notification", NotificationSchema);

module.exports = Notifications;
