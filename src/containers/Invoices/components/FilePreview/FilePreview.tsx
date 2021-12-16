import React, { useState } from "react";
import { DeletePrompt } from "../DeletePrompt";
import "./index.scss";

interface IProps {
  file: any
}

export default function FilePreview({ file }: IProps) {
  const [previewFile, setPreviewFile] = useState(URL.createObjectURL(file));
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        <div className="top">
          <img className="delete-invoice" src="/icons/trash.svg" alt="trash" onClick={() => setShowDeletePrompt(true)} />
        </div>
        <img className="preview-image" src={previewFile} alt="preview" />
        <div className="bottom">
          <button className="button-blue">Add invoice amount</button>
        </div>
      </div>
      {showDeletePrompt && <DeletePrompt onCancel={() => setShowDeletePrompt(false)} />}
    </div>
  )
}
