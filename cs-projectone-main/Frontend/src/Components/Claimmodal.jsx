import "../css/ClaimModal.css";

const ClaimModal = ({ item, onClose }) => {
  return (
    <div className="claim-modal-backdrop">
      <div className="claim-modal">
        <div className="modal-header">
          <h2>Claims for: {item.itemName}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-content">
          {item.claims.map((claim, index) => (
            <div key={index} className="claim-entry">
              <div className="claim-header">
                <img
                  src={claim.profileImage}
                  alt={claim.claimant}
                  className="claimant-img"
                />
                <div className="claim-info">
                  <strong>{claim.claimant}</strong>
                  <span
                    className={`claim-status ${claim.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
              <div className="answers-block">
                {Object.entries(claim.answers).map(
                  ([question, answer], idx) => (
                    <div key={idx} className="qa">
                      <p className="question">{question}</p>
                      <p className="answer">{answer}</p>
                    </div>
                  )
                )}
              </div>
              <div className="action-buttons">
                <button className="approve-btn">Approve</button>
                <button className="reject-btn">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
