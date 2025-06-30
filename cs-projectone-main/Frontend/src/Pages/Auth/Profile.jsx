import { useState, useRef } from "react";
import "../../css/Profile.css";
import { useLoginStore } from "../../Stores/useLoginStore";
import useCustommutation from "../../Customhooks/useMutation";
import { useCustomQuery } from "../../Customhooks/useQuery";
import useForm from "../../Customhooks/useForm";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const authuser = useLoginStore((state) => state.authuser);
  const [profileImage, setProfileImage] = useState(authuser.ProfileImg);
  const navigate = useNavigate();

  const setAuthUser = useLoginStore((state) => state.setauthUser);

  const fileInputRef = useRef(null);
  const { FormData, SetFormData, HandleInputChange } = useForm(authuser);
  console.log(authuser);
  const mutation = useCustommutation({
    onSuccess: (data) => {
      if (data.updatedAuthuser) {
        NProgress.done();
        const { message, updatedAuthuser } = data;
        console.log("Updated Authuser:", updatedAuthuser);
        console.log(updatedAuthuser);
        setAuthUser(updatedAuthuser);
        SetFormData(updatedAuthuser);
        toast.success(message);
      }
      if (data.ProfileImg) {
        NProgress.done();
        setAuthUser({ ...authuser, ProfileImg: data.ProfileImg });
        setProfileImage(data.ProfileImg);
        toast.success("Profile image updated successfully");
        // Redirect to search page after successful update
      }
    },
    onError: (error) => {
      NProgress.done();
      console.error(error);

      toast.error(error?.response?.data?.message);
    },
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        NProgress.start();
        setProfileImage(reader.result);
        mutation.mutate({
          url: `/auth/updateprofileImage`,
          method: `PATCH`,
          info: { ProfileImg: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    NProgress.start();
    mutation.mutate({
      url: `/auth/updateprofile`,
      method: `PATCH`,
      info: FormData,
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-avatar-section">
          <div
            className="avatar-wrapper"
            onClick={() => fileInputRef.current.click()}
          >
            <img src={profileImage} alt="Profile" className="profile-avatar" />
            <div className="avatar-overlay">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Change Photo
            </div>
          </div>
          <button
            className="upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload New Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden-file-input"
          />
        </div>

        <form className="profile-form-section" onSubmit={handleSubmit}>
          <h2>Profile Settings</h2>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="Firstname"
              value={FormData.Firstname}
              onChange={HandleInputChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="Surname"
              value={FormData.Surname}
              onChange={HandleInputChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              disabled={true}
              type="email"
              name="Email"
              value={FormData.Email}
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="Phonenumber"
              value={FormData.Phonenumber}
              onChange={HandleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="password-fields">
            <h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Change Password
            </h3>
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                name="OldPassword"
                onChange={HandleInputChange}
                placeholder="Enter your current password"
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="Password"
                onChange={HandleInputChange}
                placeholder="Enter your new password"
              />
            </div>
          </div>

          <button type="submit" className="save-btn" onClick={handleSubmit}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
