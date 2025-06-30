import { useEffect, useState } from "react";
import { FaSearch, FaFilter, FaCalendarAlt } from "react-icons/fa";
import LostItemCard from "../../Components/Item";
import { useCustomQuery } from "../../Customhooks/useQuery";
import useProgressBar from "../../Customhooks/useProgressbar";
import "../../css/LostItempage.css";

const LostItemsPage = () => {
  useProgressBar();

  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("ItemName");
  const [selectedCategory, setSelectedCategory] = useState("AllCategories");
  const [searchUrl, setSearchUrl] = useState("/items/searchfounditems"); // Initially no request

  const { data, isFetching, error } = useCustomQuery(
    ["searchItems", searchUrl],
    searchUrl
  );

  console.log(data);

  const handleSearch = () => {
    let url = `/items/searchfounditems?`;

    if (searchField && searchText.trim() !== "") {
      url += `${searchField}=${encodeURIComponent(searchText)}&`;
    }

    if (selectedCategory && selectedCategory !== "AllCategories") {
      url += `Category=${encodeURIComponent(selectedCategory)}&`;
    }

    if (url.endsWith("&")) {
      url = url.slice(0, -1);
    }

    setSearchUrl(url); // Triggers query
  };

  return (
    <div className="lost-items-container">
      <div className="search-filter-section">
        <div className="search-box-wrapper">
          <FaSearch className="icon" />
          <input
            type="text"
            className="search-box"
            placeholder={`Search by ${searchField}...`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="search-dropdown"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="ItemName">Item Name</option>
            <option value="Description">Description</option>
          </select>
        </div>

        <div className="filter-section">
          <select
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option>AllCategories</option>
            <option>Accessories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Bag</option>
            <option>ID-cards</option>
            <option>Other</option>
          </select>
        </div>

        {/* 🔍 Search Button (fits layout since it's part of same section) */}
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 14px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      <div className="results-header">
        <h2>
          Recently Found Items <span>{data?.data?.length || 0} items</span>
        </h2>
        <div className="sorted-by">
          <FaCalendarAlt /> Sorted by: Newest First
        </div>
      </div>

      <div className="items-grid">
        {data?.data?.map((item) => (
          <LostItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default LostItemsPage;
