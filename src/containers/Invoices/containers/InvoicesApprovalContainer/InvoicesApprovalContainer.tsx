import React, { useCallback, useMemo, useState, FC } from "react";
import { DeclineSubmissionPrompt } from "../../components/DeclineSubmissionPrompt";
import { FilePreview } from "../../components/FilePreview";
import { InvoiceApprovalItem } from "../../components/InvoiceApprovalItem";
import { Colors } from "../../../../shared/constants";
import { ButtonIcon } from "../../../../shared/components";
import CloseIcon from "../../../../shared/icons/close.icon";
import { LegalDocInfo, Proposal } from "../../../../shared/models/Proposals";
import "./index.scss";

const InvoicesApprovalContainer: FC = () => {
  const [docForPreview, setDocForPreview] = useState<LegalDocInfo | null>(null);
  const [
    proposalToBeDeclined,
    setProposalToBeDeclined,
  ] = useState<Proposal | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const handleDeclinePromptCancel = useCallback(() => {
    setProposalToBeDeclined(null);
  }, []);

  const handleSubmissionDecline = useCallback(
    (note: string) => {
      handleDeclinePromptCancel();
    },
    [handleDeclinePromptCancel]
  );

  const topFilePreviewContent = useMemo(
    () => (
      <div className="invoices-approval-wrapper__file-preview-top-wrapper">
        <ButtonIcon
          className="invoices-approval-wrapper__file-preview-close-icon"
          onClick={() => setDocForPreview(null)}
        >
          <CloseIcon width={24} height={24} fill={Colors.white} />
        </ButtonIcon>
      </div>
    ),
    []
  );

  return (
    <div className="invoices-approval-wrapper">
      {proposals.length > 0 ? (
        <ul className="invoices-approval-wrapper__items">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="invoices-approval-wrapper__item">
              <InvoiceApprovalItem
                title={proposal.title}
                description={proposal.description.description}
                amount={proposal.fundingRequest?.amount || 0}
                legalDocsInfo={proposal.legalDocsInfo || []}
                onInvoiceClick={setDocForPreview}
                onDecline={() => setProposalToBeDeclined(proposal)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <span className="invoices-approval-wrapper__no-proposals">
          There are no pending approval invoice submissions.
        </span>
      )}
      {docForPreview && (
        <FilePreview
          fileURL={docForPreview.downloadURL}
          fileName={docForPreview.name}
          isImage={docForPreview.mimeType.startsWith("image/")}
          topContent={topFilePreviewContent}
        />
      )}
      {proposalToBeDeclined && (
        <DeclineSubmissionPrompt
          onContinue={handleSubmissionDecline}
          onCancel={handleDeclinePromptCancel}
        />
      )}
    </div>
  );
};

export default InvoicesApprovalContainer;
