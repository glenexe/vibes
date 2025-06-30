import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Card.css";

const LostItemCard = ({ item }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="lost-item-card">
      <div className="image-container">
        <img
          src={item.Imageurl}
          alt={item.ItemName}
          title={item.ItemName}
          className="item-image"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
            e.target.className = "item-image placeholder";
          }}
        />

        <div className="new-badge">NEW</div>
      </div>

      <div className="card-body">
        <div className="card-header">
          <h3>{item.ItemName}</h3>
          <span className="category">{item.Category}</span>
        </div>

        <p className="description">{item.Description}</p>

        <div className="card-footer">
          <div className="location">
            <FaMapMarkerAlt className="icon" />
            <span>{item.Locationfound}</span>
          </div>
          <div className="date">Posted {formattedDate}</div>
        </div>

        <button
          onClick={() => navigate(`/claimpage/${item._id}`)}
          className="details-button"
        >
          <FaEye className="icon" /> View Details
        </button>
      </div>
    </div>
  );
};

export default LostItemCard;
