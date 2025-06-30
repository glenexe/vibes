import React from "react";
import { useState } from "react";
import useForm from "../../../Customhooks/useForm";
import useCustommutation from "../../../Customhooks/useMutation";
import { toast } from "react-hot-toast";

export const Upload = () => {
  const [Imageurl, setImageurl] = useState("");
  const mutation = useCustommutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const ItemData = {
    ItemName: "",
    Description: "",
    Category: "",
    Locationfound: "",
  };
  const { FormData, SetFormData, HandleInputChange } = useForm(ItemData);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageurl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImageurl("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      url: `/items/uploadfounditem`,
      method: "POST",
      info: {
        ...FormData,
        Imageurl,
      },
    });
  };

  return (
    <div className="upload-form">
      <h2>📝 Upload a New Found Item</h2>
      <form className="upload-form-fields" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Item Name"
          name="ItemName"
          onChange={HandleInputChange}
        />
        <textarea
          placeholder="Item Description"
          name="Description"
          onChange={HandleInputChange}
        />
        <select
          name="Category"
          className="form-input"
          onChange={HandleInputChange}
        >
          <option value="">Select a category</option>
          <option value="Clothing">Clothing</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Accessories">Accessories</option>
          <option value="Others">Others</option>
          <option value="ID-cards">ID Cards</option>
        </select>

        <input
          type="text"
          placeholder="Location Found"
          name="Locationfound"
          onChange={HandleInputChange}
        />

        {/* 👇 Custom File Upload */}
        <div className="custom-upload-container">
          <label htmlFor="imageUpload" className="custom-upload-button">
            📷 Choose Image
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        {/* 👇 Image Preview */}
        {Imageurl && (
          <div className="preview-container">
            <span className="remove-preview" onClick={removeImage}>
              ❌
            </span>
            <img src={Imageurl} alt="Preview" className="preview-image" />
          </div>
        )}

        <button type="submit" className="submit-btn">
          Upload Item
        </button>
        <p className="note-text">
          📌 <strong>Note:</strong> Verification questions can only be added
          once the item is approved by an admin.
        </p>
      </form>
    </div>
  );
};
