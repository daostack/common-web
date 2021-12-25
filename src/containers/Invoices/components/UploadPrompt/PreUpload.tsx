import React from "react";

interface IProps {
  onUpload: () => void
  onCancel: () => void
  updateUploadState: () => void
}

export default function PreUpload({ onUpload, onCancel, updateUploadState }: IProps) {
  return (
    <div className="pre-upload-wrapper">
      <span className="pre-upload__title">Please, make sure you've uploaded all invoices</span>
      <span>You won't be able to add after uploading</span>
      <button className="button-blue" onClick={() => { onUpload(); updateUploadState(); }} >Upload Invoices</button>
      <button className="button-blue transparent" onClick={onCancel}>I have more invoices to upload</button>
    </div>
  )
}
