import { useState } from "react";
import { Bell } from "lucide-react";
import "../css/Notification.css";
import { useCustomQuery } from "../Customhooks/useQuery";

import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import useProgressBar from "../Customhooks/useProgressbar";
import useCustommutation from "../Customhooks/useMutation";

import getRelativeTime from "../Utils/time";

const NotificationPage = () => {
  const navigate = useNavigate();
  useProgressBar();
  const {
    data: Notifications,
    isFetching,
    error,
  } = useCustomQuery(`getnotifications`, `/notifications/getallNotifications`);

  const queryClient = useQueryClient();

  console.log(Notifications);
  const mutation = useCustommutation({
    onSuccess: (data) => {
      const { link } = data;
      console.log(link);
      queryClient.invalidateQueries({
        queryKey: ["getnotifications"],
      });
      queryClient.invalidateQueries("claimItem");
      navigate(link);
    },
    onError: (error) => {
      console.log(error?.response?.data?.message);
    },
  });

  const handleClick = (e, notificationid) => {
    e.preventDefault();
    mutation.mutate({
      url: `/notifications/markasRead/${notificationid}`,
      method: `PATCH`,
    });
  };

  return (
    <div className="notification-page">
      <h2>
        <Bell size={22} style={{ marginRight: 8 }} /> Notifications
      </h2>

      <div className="notifications-list">
        {Notifications?.data?.map((notification) => (
          <div
            key={notification?._id}
            className={`notification-card ${
              notification?.read ? "read" : "unread"
            }`}
            onClick={(e) => {
              handleClick(e, notification?._id);
            }}
          >
            <h4>{notification?.type}</h4>
            <p>{notification?.message}</p>
            <span className="timestamp">
              {getRelativeTime(notification?.createdAt)}
            </span>
            {!notification?.read && <span className="new-badge">New</span>}
          </div>
        ))}
        {Notifications?.data?.length === 0 && (
          <p className="empty">No notifications yet.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
