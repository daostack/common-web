import React, { useState } from "react";
import { IFile } from "../AddInvoices/AddInvoices";
import PendingUpload from "./PendingUpload";
import PreUpload from "./PreUpload";
import UploadSuccess from "./UploadSuccess";
import "./index.scss";

interface IProps {
  proposalId: string;
  selectedFiles: IFile[];
  onCancel: () => void;
  invoicesTotal: string;
  proposalRequest: string;
  updateSubmissionStatus: () => void;
}

export enum UploadState {
  PreUpload,
  Pending,
  Success
}

export default function UploadPrompt({ proposalId, selectedFiles, onCancel, invoicesTotal, proposalRequest, updateSubmissionStatus }: IProps) {
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.PreUpload);
  const [payoutDocsComment, setPayoutDocsComment] = useState(""); 

  const renderContent = (uploadState: UploadState) => {
    switch (uploadState) {
      case UploadState.PreUpload:
        return (
          <PreUpload
            onCancel={onCancel}
            updateUploadState={() => setUploadState(UploadState.Pending)}
            invoicesTotal={invoicesTotal}
            proposalRequest={proposalRequest}
            payoutDocsComment={payoutDocsComment}
            setPayoutDocsComment={setPayoutDocsComment} />
        )
      case UploadState.Pending:
        return <PendingUpload
          proposalId={proposalId}
          selectedFiles={selectedFiles}
          updateUploadState={setUploadState}
          payoutDocsComment={payoutDocsComment} />
      case UploadState.Success:
        return <UploadSuccess closePrompt={onCancel} updateSubmissionStatus={updateSubmissionStatus} />
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
