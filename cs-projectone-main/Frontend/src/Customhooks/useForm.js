import { useState } from "react";

const useForm = (initialstate) => {
  const [FormData, SetFormData] = useState(initialstate);
  const HandleInputChange = (e) => {
    const { name, value } = e.target;
    SetFormData({ ...FormData, [name]: value });
  };
  return { FormData, SetFormData, HandleInputChange };
};

export default useForm;
