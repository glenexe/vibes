import { Search, Box, ClipboardList, Home } from "lucide-react";

import { FaRegUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomQuery } from "../Customhooks/useQuery";

import useCustommutation from "../Customhooks/useMutation";
import { useLoginStore } from "../Stores/useLoginStore";
import { toast } from "react-hot-toast";

import "../css/Sidebar.css";

export const Sidebar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const setAuthUser = useLoginStore((state) => state.setauthUser);
  const authuser = useLoginStore((state) => state.authuser);
  console.log(authuser?._id);

  const navigate = useNavigate();

  const {
    data: Notifications,
    isFetching,
    error,
  } = useCustomQuery(`getnotifications`, `/notifications/getallNotifications`);

  console.log(Notifications);

  const unreadCount =
    (authuser &&
      Notifications?.data?.filter((n) => !n.read && n.to === authuser._id)
        ?.length) ||
    0;
  console.log(unreadCount);

  const mutation = useCustommutation({
    onSuccess: (data) => {
      const { message } = data;
      toast.success(message);
      localStorage.removeItem("auth-user");
      setAuthUser(null);
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>StrathFind</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/search" className="nav-item">
            <Home size={24} className="nav-icon" />
            <span className="nav-text">Home</span>
          </Link>

          <Link to="/finderdashboard" className="nav-item">
            <Box size={24} className="nav-icon" />
            <span className="nav-text">My Items</span>
          </Link>

          <Link to="/myclaims" className="nav-item">
            <ClipboardList size={24} className="nav-icon" />
            <span className="nav-text">My Claims</span>
          </Link>

          {/*  Notification link with unread badge */}
          <Link to="/notifications" className="nav-item notification-nav">
            <Search size={24} className="nav-icon" />
            <span className="nav-text">Notifications</span>
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </Link>

          <Link to="/profile" className="nav-item">
            <FaRegUser size={20} className="nav-icon" />
            <span className="nav-text">Profile</span>
          </Link>
        </nav>

        <div className="Profile-section">
          <div className="Profile-picture-container">
            {authuser.ProfileImg ? (
              <img src={authuser.ProfileImg} alt="Profile" />
            ) : (
              <FaRegUser className="profile-pic" size={20} />
            )}
          </div>

          <div className="Profile-name">
            <article>{authuser.Firstname || "Guest"}</article>
            <article>@{authuser.Surname.toLowerCase() || "guest"}</article>
          </div>

          <div
            className="logout-icons"
            onClick={(e) => {
              mutation.mutate({
                url: "/auth/logout",
                method: "POST",
              });
            }}
            style={{ cursor: "pointer" }}
          >
            <TbLogout2 size={22} />
          </div>
        </div>
      </aside>
    </>
  );
};
