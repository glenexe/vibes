import { useState } from "react";
import { Mail, Search, User } from "lucide-react";
import { useSignupStore } from "../../../Stores/useSignupStore";
import { StartSignUp } from "./Step1";
import { VerificationPage } from "./Step2";
import { CompleteSignUp } from "./Step3";
import "../../../css/login.css";
export const Signup = () => {
  const { step } = useSignupStore();

  const getStepIcon = () => {
    switch (step) {
      case 1:
        return <Search size={28} />;
      case 2:
        return <Mail size={28} />;
      case 3:
        return <User size={28} />;

      default:
        return <Search size={28} />;
    }
  };

  return (
    <div className="container">
      <div className="signup-wrapper">
        {/* Left Section */}
        <div className="signup-left">
          <div className="step-indicator">
            <div className={`step-circle ${step === 1 ? "active" : ""}`}></div>
            <div className={`step-circle ${step === 2 ? "active" : ""}`}></div>
            <div className={`step-circle ${step === 3 ? "active" : ""}`}></div>
          </div>

          <div className="icon-circle">{getStepIcon()}</div>

          <div className="step-container">
            {step === 1 && <StartSignUp />}

            {step === 2 && <VerificationPage />}
            {step === 3 && <CompleteSignUp />}
          </div>
        </div>

        {/* Right Section */}
        <div
          className="signup-right minimal-info"
          style={{
            animation: "fadeInUp 0.6s ease-out",
            animationFillMode: "both",
          }}
        >
          <h2 className="form-title white">Why StrathFind?</h2>
          <p className="form-subtitle light">
            Empower students to recover lost items quickly and securely.
          </p>
          <ul className="benefits-list">
            <li>✔️ Mahn! Recover you Item</li>
            <li>✔️ Fast item-owner matching</li>
            <li>✔️ Secure verification system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
