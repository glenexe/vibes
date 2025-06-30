import { useNavigate } from "react-router-dom";

import { User, Phone } from "lucide-react";
import useCustommutation from "../../../Customhooks/useMutation";
import { useSignupStore } from "../../../Stores/useSignupStore";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export const CompleteSignUp = () => {
  const handleChange = useSignupStore((state) => state.handleChange);
  const getStepData = useSignupStore((state) => state.getStepData);
  const resetStep = useSignupStore((state) => state.resetStep);
  const resetForm = useSignupStore((state) => state.resetForm);
  const navigate = useNavigate();

  const mutation = useCustommutation({
    onSuccess: async (data) => {
      const { message } = data;
      await Swal.fire({
        icon: "success",
        title: `${message}`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      resetForm();
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      url: `/auth/completesignup`,
      method: `POST`,
      info: getStepData(),
    });
  };
  return (
    <div className="step-panel animate-in">
      <h2 className="form-title">Complete Your Profile</h2>
      <p className="form-subtitle">Help us identify you for item recovery.</p>

      <div className="input-group">
        <div className="input-with-icon">
          <User size={18} className="input-icon" />
          <input
            type="text"
            name="Firstname"
            placeholder="First name"
            className="input-field"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <div className="input-with-icon">
          <User size={18} className="input-icon" />
          <input
            type="text"
            name="Surname"
            placeholder="Surname"
            className="input-field"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="input-group">
        <div className="input-with-icon">
          <Phone size={18} className="input-icon" />
          <input
            type="tel"
            name="Phonenumber"
            placeholder="Phone number"
            className="input-field"
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="primary-button" onClick={handleSubmit}>
        Complete Registration
      </button>
    </div>
  );
};
