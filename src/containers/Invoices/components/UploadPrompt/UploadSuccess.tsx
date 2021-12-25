import React from "react";

interface IProps {
  closePrompt: () => void
}

export default function UploadSuccess({ closePrompt }: IProps) {
  return (
    <div className="upload-success-wrapper">
      <img src="/icons/checkmark.svg" alt="checkmark" />
      <span className="upload-success__title">Invoices uploaded successfully!</span>
      <span>You will be notified via email after your invoices will be reviewed</span>
      <button className="button-blue" onClick={closePrompt}>Done</button>
    </div>
  )
}
