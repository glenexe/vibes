import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSignupStore = create(
  persist(
    (set, get) => ({
      step: 1,
      Email: "",
      Password: "",
      Firstname: "",
      Surname: "",
      Phonenumber: "",
      showPassword: false,
      otp: ["", "", "", "", "", ""],

      setOtpAtIndex: (index, value) =>
        set((state) => {
          const newOtp = [...state.otp];
          newOtp[index] = value;
          return { otp: newOtp };
        }),
      resetOtp: () => set({ otp: ["", "", "", "", "", ""] }),

      resetForm: () => {
        set(() => ({
          step: 1,
          Email: "",
          Password: "",
          Firstname: "",
          Surname: "",
          Phonenumber: "",
          showPassword: false,
          otp: ["", "", "", "", "", ""],
        }));
      },

      gotoStep: (n) => set(() => ({ step: n })),
      resetStep: () => set(() => ({ step: 1 })),

      togglePasswordVisibility: () =>
        set((state) => ({ showPassword: !state.showPassword })),

      setField: (key, value) => set({ [key]: value }),

      getStepData: () => {
        const state = get();
        switch (state.step) {
          case 1:
            return {
              Email: state.Email,
              Password: state.Password,
            };
          case 2:
            return { Email: state.Email };
          case 3:
            return {
              Firstname: state.Firstname,
              Surname: state.Surname,
              Phonenumber: state.Phonenumber,
              Email: state.Email,
            };
          default:
            return {};
        }
      },

      handleChange: (e) => {
        get().setField(e.target.name, e.target.value);
      },
    }),
    {
      name: "signup-storage", // Key name in localStorage
      partialize: (state) => ({
        step: state.step,
        Email: state.Email,
      }),
    }
  )
);
