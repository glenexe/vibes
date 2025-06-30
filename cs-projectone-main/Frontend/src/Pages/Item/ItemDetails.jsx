import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../css/details.css";
import { useCustomQuery } from "../../Customhooks/useQuery";
import useCustommutation from "../../Customhooks/useMutation";
import { toast } from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";

const ItemDetailsPage = () => {
  const [Questions, setQuestions] = useState([""]);
  const { itemId } = useParams();
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [Status, setStatus] = useState("approved");
  const [activeClaimId, setActiveClaimId] = useState(null);
  const [buttonname, setbuttonName] = useState(null);

  const questionmutation = useCustommutation({
    onSuccess: (data) => {
      const { message } = data;
      setQuestions([""]);
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const escalatemutation = useCustommutation({
    onSuccess: (data) => {
      const { message } = data;
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const reviewmutation = useCustommutation({
    onSuccess: (data) => {
      toast.success(data.message || "Claim reviewed successfully.");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
    onSettled: () => {
      setActiveClaimId(null); // reset the spinner state
    },
  });

  const {
    data: ItemDetails,
    isFetching,
    error,
  } = useCustomQuery(`claimsreview`, `claims/getclaims/${itemId}`);

  const handleQuestionChange = (index, value) => {
    const updated = [...Questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const handleReview = (e, claimid) => {
    e.preventDefault();
    setbuttonName(e.target.name);
    const reviewStatus = e.target.name === "approve" ? "approved" : "rejected";

    setActiveClaimId(claimid);
    reviewmutation.mutate({
      url: `claims/reviewclaim/${claimid}/Item/${itemId}`,
      method: `PATCH`,
      info: { Status: reviewStatus },
    });
  };

  const handleEscalate = (e) => {
    e.preventDefault();
    escalatemutation.mutate({
      url: `items/escalateitem/${itemId}`,
      method: `PATCH`,
    });
  };

  const handleAddQuestion = () => setQuestions([...Questions, ""]);

  const handleSubmit = (e, itemId) => {
    e.preventDefault();
    questionmutation.mutate({
      url: `/questions/uploadverificationquestion/${itemId}`,
      method: `POST`,
      info: { Questions },
    });
  };

  return (
    <div className="item-details-page">
      <div className="item-header side-by-side">
        <img
          src={ItemDetails?.data?.Imageurl}
          alt={ItemDetails?.data?.ItemName}
        />
        <div className="item-info">
          <h1>{ItemDetails?.data?.ItemName}</h1>
          <p className="meta">{ItemDetails?.data?.Description}</p>
          <p className="meta">Category: {ItemDetails?.data?.Category}</p>
          <p className="meta">Found: {ItemDetails?.data?.Locationfound}</p>
          <p className="meta">Date Posted: {ItemDetails?.data?.createdAt}</p>

          <div className="status-wrapper">
            <span className={`status-badge ${ItemDetails?.data?.Status}`}>
              {ItemDetails?.data?.Status}
            </span>
          </div>

          {ItemDetails?.data?.Status === "approved" && (
            <div className="verification-section-inline">
              <h3>🛡️ Set Verification Questions</h3>
              <form
                onSubmit={(e) => {
                  handleSubmit(e, ItemDetails?.data?._id);
                }}
              >
                {Questions.map((q, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Question ${i + 1}`}
                    value={q}
                    onChange={(e) => handleQuestionChange(i, e.target.value)}
                    required
                  />
                ))}
                <button type="button" onClick={handleAddQuestion}>
                  ➕ Add Another Question
                </button>
                <button type="submit">
                  {questionmutation.isPending ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
              {submittedQuestions.length > 0 && (
                <div className="verification-questions-display">
                  <h4>✔️ Submitted Questions:</h4>
                  <ul>
                    {submittedQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="claims-section">
        <h2>Claims on this Item</h2>

        {ItemDetails?.data?.isEscalated === true ? (
          <div>
            <p>Item escalated for Admin Review</p>
          </div>
        ) : ItemDetails?.data?.Claims?.length === 0 ? (
          <p>No claims yet.</p>
        ) : (
          ItemDetails?.data?.Claims.map((claim) => (
            <div className="claim-card" key={claim?._id}>
              <div className="claimant-info">
                {claim?.User?.ProfileImg ? (
                  <img
                    src={claim.User.ProfileImg}
                    alt={claim.User.Firstname || "User"}
                    className="claimant-img"
                  />
                ) : (
                  <FaRegUser className="claimant-img fallback-icon" />
                )}
                <strong>{claim?.User?.Email}</strong>
                <span
                  className={`claim-status ${claim?.Status.toLowerCase().replace(
                    " ",
                    "-"
                  )}`}
                >
                  {claim?.Status}
                </span>
              </div>
              <div className="answers">
                {claim?.Answers?.map((Answer) => (
                  <p key={Answer?._id}>
                    <strong>{Answer?.Question_id?.Questiontext}</strong>:{" "}
                    {Answer?.Answertext}
                  </p>
                ))}
              </div>
              <div className="action-buttons">
                <button
                  name="approve"
                  className="approve-btn"
                  onClick={(e) => handleReview(e, claim?._id)}
                >
                  {reviewmutation.isPending &&
                  activeClaimId === claim?._id &&
                  buttonname === "approve" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Approve"
                  )}
                </button>
                <button
                  name="reject"
                  className="reject-btn"
                  onClick={(e) => handleReview(e, claim?._id)}
                >
                  {reviewmutation.isPending &&
                  activeClaimId === claim?._id &&
                  buttonname === "reject" ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    "Reject"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {ItemDetails?.data?.Status === "approved" &&
        ItemDetails?.data?.Claims.length > 0 &&
        !ItemDetails?.data?.isEscalated && (
          <div className="escalate-section">
            <h3>Need more time?</h3>
            <p>
              If you're unable to decide based on the current claims, you can
              escalate this item for further review.
            </p>
            <button className="escalate-btn" onClick={handleEscalate}>
              {questionmutation.isPending ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "🚨 Escalate Item"
              )}
            </button>
          </div>
        )}
    </div>
  );
};

export default ItemDetailsPage;
