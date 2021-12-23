import React from "react";
import "./index.scss";

interface IProps {
  onUpload: () => void
  onCancel: () => void
}

export default function UploadPrompt({ onUpload, onCancel }: IProps) {
  return (
    <div className="upload-prompt-wrapper">
      <div className="upload-prompt-overlay" />
      <div className="content-container">
        <div className="content">
          <span>Please, make sure you've uploaded all invoices</span>
          <button className="button-blue" onClick={onUpload} >Upload Invoices</button>
          <button className="button-blue transparent" onClick={onCancel}>I have more invoices to upload</button>
        </div>
      </div>
    </div>
  )
}
