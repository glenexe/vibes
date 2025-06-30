import { useState } from "react";
import {
  FaWallet,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import "../../css/ClaimPage.css";
import { useParams } from "react-router-dom";
import { useCustomQuery } from "../../Customhooks/useQuery";
import useProgressBar from "../../Customhooks/useProgressbar";
import useCustommutation from "../../Customhooks/useMutation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const ClaimPage = () => {
  useProgressBar();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { itemId } = useParams(); // Get itemId from URL params
  console.log("Item ID:", itemId);
  const { data, isFetching, error } = useCustomQuery(
    "claimItem",
    `questions/getverificationquestions/Item/${itemId}`
  );
  const mutation = useCustommutation({
    onSuccess: (data) => {
      NProgress.done();
      console.log(data);
      toast.success(data.message, {
        position: "bottom-right", // optional override (optional if set globally)
      });
      setIsSubmitted(true);
      queryClient.invalidateQueries("claimItem");
    },
    onError: (error) => {
      NProgress.done();
      toast.error(error?.response?.data?.message);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const answers = data?.item?.Questions.map((question) => ({
      Question_id: question?._id,
      Answertext: formData.get(question?._id),
    }));
    NProgress.start();
    mutation.mutate({
      url: `/claims/claimitem/${itemId}`,
      method: `POST`,
      info: { answers },
    });
  };

  return (
    <div className="claim-page-container">
      {/* Header */}
      <div className="claim-header">
        <h1>Claim This Item</h1>
        <p>Please verify you're the owner by answering these questions</p>
      </div>

      {/* Main Content */}
      <div className="claim-content">
        {/* Left Section - Item Details */}
        <div className="claim-item-section">
          <div className="item-image-container">
            <img
              src={data?.item?.Imageurl}
              alt={data?.item?.ItemName}
              className="item-image"
            />
          </div>

          <div className="item-details">
            <h2>{data?.item?.ItemName}</h2>

            <div className="detail-row">
              <FaWallet className="detail-icon" />
              <span>
                <strong>Category:</strong> {data?.item?.Category}
              </span>
            </div>

            <div className="detail-row">
              <FaMapMarkerAlt className="detail-icon" />
              <span>
                <strong>Location Found:</strong> {data?.item?.Locationfound}
              </span>
            </div>

            <div className="detail-row">
              <FaCalendarAlt className="detail-icon" />
              <span>
                <strong>Date Posted:</strong>{" "}
                {new Date(data?.item?.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="item-description">
              <h3>Description</h3>
              <p>{data?.item?.Description}</p>
            </div>
          </div>
        </div>

        {/* Right Section - Claim Form */}
        <div className="claim-form-section">
          {isSubmitted ? (
            <div className="success-message">
              <FaCheckCircle className="success-icon" />
              <h3>Claim Submitted Successfully!</h3>
              <p>
                We've received your claim request. Our team will review your
                information and contact you within 24-48 hours.
              </p>
            </div>
          ) : (
            <>
              <h3>Verification Questions</h3>
              <form className="claim-form" onSubmit={handleSubmit}>
                {data?.item?.Questions?.map((question) => {
                  console.log(question);
                  return (
                    <div className="form-group" key={question?._id}>
                      <label>{question?.Questiontext}</label>
                      <input
                        type="text"
                        name={question?._id}
                        placeholder="e.g., Brown"
                        required
                      />
                    </div>
                  );
                })}

                <button type="submit" className="submit-button">
                  {mutation.isPending ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Submit Claim"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
