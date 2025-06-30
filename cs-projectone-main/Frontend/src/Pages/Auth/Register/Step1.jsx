import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useSignupStore } from "../../../Stores/useSignupStore";
import useCustommutation from "../../../Customhooks/useMutation";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export const StartSignUp = () => {
  const showPassword = useSignupStore((state) => state.showPassword);
  const togglePasswordVisibility = useSignupStore(
    (state) => state.togglePasswordVisibility
  );
  const gotoStep = useSignupStore((state) => state.gotoStep);
  const handleChange = useSignupStore((state) => state.handleChange);
  const getStepData = useSignupStore((state) => state.getStepData);

  const mutation = useCustommutation({
    onSuccess: (data) => {
      const { email } = data;
      useSignupStore.setState({ Email: email });
      gotoStep(2);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      url: `/auth/startsignup`,
      method: `POST`,
      info: getStepData(),
    });
  };

  return (
    <div className="step-panel animate-in">
      <h2 className="form-title">Create your StrathFind account</h2>
      <p className="form-subtitle">Reconnect students with their lost items.</p>

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
            placeholder="Create a strong password"
            className="input-field pl-10 pr-10" // Added padding for icons
            name="Password"
            onChange={handleChange}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => togglePasswordVisibility()}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} className="text-gray-500" />
            ) : (
              <Eye size={18} className="text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <button type="button" onClick={handleSubmit} className="primary-button">
        {mutation.isPending ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};
