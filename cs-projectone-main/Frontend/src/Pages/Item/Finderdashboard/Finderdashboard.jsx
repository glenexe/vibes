import { useState } from "react";
import LostItemCard from "../../../Components/Item";
import "../../../css/Finderdashboard.css";
import { useNavigate } from "react-router-dom";
import { Upload } from "./Upload";
import { useCustomQuery } from "../../../Customhooks/useQuery";
import useProgressBar from "../../../Customhooks/useProgressbar";

const FinderDashboard = () => {
  useProgressBar();
  const [activeTab, setActiveTab] = useState("uploaded");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const {
    data: items,
    isFetching,
    error,
  } = useCustomQuery(
    ["FoundItems", statusFilter],
    `/items/getallfounderitems${
      statusFilter !== "all" ? `?Status=${statusFilter}` : ""
    }`
  );
  console.log(items);
  return (
    <div className="finder-dashboard">
      <div className="tab-buttons">
        <button
          className={activeTab === "uploaded" ? "active" : ""}
          onClick={() => setActiveTab("uploaded")}
        >
          Uploaded Items
        </button>
        <button
          className={activeTab === "upload" ? "active" : ""}
          onClick={() => setActiveTab("upload")}
        >
          Upload New Item
        </button>
      </div>

      {activeTab === "uploaded" && (
        <>
          <div className="dashboard-header">
            <h2>📦 My Uploaded Items</h2>
            <p className="subtext">
              Track your uploaded items and manage claims. Click an item to view
              claim details.
            </p>
          </div>

          <div className="status-filters">
            {["all", "approved", "pending", "rejected"].map((status) => (
              <button
                key={status}
                className={`filter-button ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="items-grid">
            {items?.data?.length === 0 ? (
              <p className="noitems">
                {statusFilter === "all"
                  ? `No uploaded Items yet`
                  : `You have no ${statusFilter} items`}
              </p>
            ) : (
              items?.data?.map((item) => (
                <div
                  key={item?._id}
                  className="upload-status-wrapper"
                  onClick={() => navigate(`/finder/item/${item?._id}`)}
                >
                  <LostItemCard item={item} showStatusBadge />
                  <div className={`status-badge ${item?.Status.toLowerCase()}`}>
                    {item?.status}
                  </div>
                  {item?.hasNewClaims && (
                    <span className="new-claim-tag">New Claim</span>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === "upload" && <Upload />}
    </div>
  );
};

export default FinderDashboard;
