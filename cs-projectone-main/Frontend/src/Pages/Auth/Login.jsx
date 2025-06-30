import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../css/login.css";

import useCustommutation from "../../Customhooks/useMutation";
import { useLoginStore } from "../../Stores/useLoginStore";
import { useSignupStore } from "../../Stores/useSignupStore";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const showPassword = useSignupStore((state) => state.showPassword);
  const togglePasswordVisibility = useSignupStore(
    (state) => state.togglePasswordVisibility
  );
  const handleChange = useLoginStore((state) => state.handleChange);
  const getLoginData = useLoginStore((state) => state.getLoginData);
  const setAuthUser = useLoginStore((state) => state.setauthUser);
  const mutation = useCustommutation({
    onSuccess: (data) => {
      const { message, Authuser } = data;
      console.log(Authuser);
      toast.success(message);
      setAuthUser(Authuser);

      navigate("/Search");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      url: `/auth/login`,
      method: `POST`,
      info: getLoginData(),
    });
  };

  return (
    <div className="container">
      <div className="signup-wrapper">
        <div className="signup-left">
          <div className="icon-circle">
            <LogIn size={28} />
          </div>

          <div className="step-panel animate-in">
            <h2 className="form-title">Welcome Back</h2>
            <p className="form-subtitle">
              Login to continue helping students reunite with their lost items.
            </p>

            <div className="input-group">
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="University email address"
                  className="input-field"
                  name="Email"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="input-field"
                  name="Password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility()}
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-500" />
                  ) : (
                    <Eye size={18} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <button className="primary-button" onClick={handleSubmit}>
              Login
            </button>

            <p className="form-subtitle" style={{ marginTop: "1.5rem" }}>
              Don’t have an account?{" "}
              <Link to="/Signup" className="text-blue-500 underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div
          className="signup-right minimal-info "
          style={{
            animation: "fadeInUp 0.6s ease-out",
            animationFillMode: "both",
          }}
        >
          <h2 className="form-title white">Welcome to StrathFind</h2>
          <p className="form-subtitle light">Reconnect. Recover. Reunite.</p>
          <ul className="benefits-list">
            <li>✔️ Secure login</li>
            <li>✔️ Community powered</li>
            <li>✔️ Effortless item recovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
