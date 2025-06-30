import React from "react";

const Homeicon = () => (
  <svg
    width="96"
    height="96"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background House Base */}
    <rect x="14" y="20" width="20" height="16" rx="2" fill="#F3F4F6" />

    {/* Roof */}
    <path
      d="M12 22L24 10L36 22"
      stroke="#3B82F6"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Door */}
    <rect x="22" y="26" width="4" height="10" fill="#3B82F6" rx="1" />
  </svg>
);
export default Homeicon;
