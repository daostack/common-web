import React from "react";

interface IProps {
  closePrompt: () => void;
  updateSubmissionStatus: () => void;
}

export default function UploadSuccess({
  closePrompt,
  updateSubmissionStatus,
}: IProps) {
  const handleDone = () => {
    updateSubmissionStatus();
    closePrompt();
  };

  return (
    <div className="upload-success-wrapper">
      <img src="/icons/checkmark.svg" alt="checkmark" />
      <span className="upload-success__title">
        Invoices uploaded successfully!
      </span>
      <span className="upload-success__sub-text">
        You will be notified via email after your invoices will be reviewed
      </span>
      <button className="button-blue" onClick={handleDone}>
        Done
      </button>
    </div>
  );
}
