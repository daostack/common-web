import React from "react";
import { Button, ButtonVariant } from "../../../../shared/components";

interface IProps {
  onCancel: () => void;
  updateUploadState: () => void;
  invoicesTotal: string;
  proposalRequest: string;
  payoutDocsComment: string;
  setPayoutDocsComment: (value: string) => void;
}

export default function PreUpload({
  onCancel,
  updateUploadState,
  invoicesTotal,
  proposalRequest,
  payoutDocsComment,
  setPayoutDocsComment,
}: IProps) {
  return (
    <div className="pre-upload-wrapper">
      <span className="pre-upload__title">
        Please, make sure you've uploaded all invoices
      </span>
      <span className="pre-upload__sub-title">
        You won't be able to add after uploading
      </span>
      <div className="summary-wrapper">
        <div className="summary-item">
          <span className="summary-item__title">Proposal Request</span>
          <span className="summary-item__value">{proposalRequest}</span>
        </div>
        <div className="summary-item">
          <span className="summary-item__title">Invoices Total</span>
          <span className="summary-item__value">{invoicesTotal}</span>
        </div>
      </div>
      <textarea
        value={payoutDocsComment}
        onChange={(e) => setPayoutDocsComment(e.target.value)}
        rows={5}
        placeholder="Add Note"
      />
      <Button onClick={updateUploadState} shouldUseFullWidth>
        Upload Invoices
      </Button>
      <Button
        className="pre-upload-wrapper__cancel-button"
        onClick={onCancel}
        variant={ButtonVariant.Secondary}
        shouldUseFullWidth
      >
        I have more invoices to upload
      </Button>
    </div>
  );
}
