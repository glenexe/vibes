import { useSignupStore } from "../../../Stores/useSignupStore";
import { useEffect } from "react";
import useCustommutation from "../../../Customhooks/useMutation";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";

export const VerificationPage = () => {
  const gotoStep = useSignupStore((state) => state.gotoStep);
  const otp = useSignupStore((state) => state.otp);
  const setOtpAtIndex = useSignupStore((state) => state.setOtpAtIndex);
  const getStepData = useSignupStore((state) => state.getStepData);

  const mutation = useCustommutation({
    onSuccess: (data) => {
      gotoStep(3);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleChange = (e, i) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    setOtpAtIndex(i, value);

    // Auto-focus next input
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };
  useEffect(() => {
    const otpCode = otp.join("");

    if (otpCode.length === 6 && !otp.includes("")) {
      handleSubmit(otpCode);
    }
  }, [otp]);

  const handleSubmit = (otpCode) => {
    mutation.mutate({
      url: `/auth/verification`,
      method: `POST`,
      info: { ...getStepData(), verificationcode: otpCode },
    });
  };

  return (
    <div className="step-panel animate-in">
      <h2 className="form-title">Verify your email</h2>
      <p className="form-subtitle">We sent a code to your email address:</p>
      <div className="form-subtitle bold">{getStepData().Email}</div>
      <p className="form-subtitle">Enter the 6-digit code below:</p>

      <div className="otp-container">
        {otp &&
          otp.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="otp-input"
              inputMode="numeric"
              pattern="[0-9]*"
              name="Otp-box"
              value={digit}
              onChange={(e) => handleChange(e, i)}
            />
          ))}
        {mutation.isPending && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        {mutation.isSuccess && (
          <Check className="w-6 h-6 text-green-600" strokeWidth={2.5} />
        )}
        {mutation.isError && (
          <X className="w-6 h-6 text-red-600" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
};
