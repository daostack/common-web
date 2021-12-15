import React, { useState } from "react";
import "./index.scss";

interface IProps {
  file: any
}

export default function FilePreview({ file }: IProps) {
  const [previewFile, setPreviewFile] = useState(URL.createObjectURL(file))

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        <img src={previewFile} alt="preview" />
      </div>
    </div>
  )
}
