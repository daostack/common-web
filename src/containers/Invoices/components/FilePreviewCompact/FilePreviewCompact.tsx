import React from "react";
import "./index.scss";

interface IProps {
  file: any
}

export default function FilePreviewCompact({ file }: IProps) {
  return (
    <div className="file-preview-compact-wrapper">
      <img src={URL.createObjectURL(file)} alt="preview" />
    </div>
  )
}
