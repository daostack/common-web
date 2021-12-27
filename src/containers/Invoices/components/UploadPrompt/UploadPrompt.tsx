import React, { useState } from "react";
import "./index.scss";
import PendingUpload from "./PendingUpload";
import PreUpload from "./PreUpload";
import UploadSuccess from "./UploadSuccess";

interface IProps {
  onUpload: () => void
  onCancel: () => void
  invoicesTotal: string
  proposalRequest: string
}

enum UploadState {
  PreUpload,
  Pending,
  Success
}

export default function UploadPrompt({ onUpload, onCancel, invoicesTotal, proposalRequest }: IProps) {
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.PreUpload);

  const renderContent = (uploadState: UploadState) => {
    switch (uploadState) {
      case UploadState.PreUpload:
        return (
          <PreUpload
            onUpload={onUpload}
            onCancel={onCancel}
            updateUploadState={() => setUploadState(UploadState.Pending)}
            invoicesTotal={invoicesTotal}
            proposalRequest={proposalRequest} />
        )
      case UploadState.Pending:
        return <PendingUpload updateUploadState={() => setUploadState(UploadState.Success)} />
      case UploadState.Success:
        return <UploadSuccess closePrompt={onCancel} />
    }
  }

  return (
    <div className="upload-prompt-wrapper">
      <div className="upload-prompt-overlay" />
      <div className="content-container">
        <div className="content">
          {renderContent(uploadState)}
        </div>
      </div>
    </div>
  )
}
