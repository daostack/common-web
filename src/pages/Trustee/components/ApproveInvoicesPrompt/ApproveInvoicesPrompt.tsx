import React, { FC } from "react";
import { Loader, Modal } from "../../../../shared/components";
import CheckIcon from "../../../../shared/icons/check.icon";
import ConfirmationIcon from "../../../../shared/icons/confirmation.icon";
import "./index.scss";

interface ApproveInvoicesPromptProps {
  isOpen: boolean;
  isLoading: boolean;
  isFinished: boolean;
  isReapproval?: boolean;
  onApprove: () => void;
  onClose: () => void;
}

const ApproveInvoicesPrompt: FC<ApproveInvoicesPromptProps> = (props) => {
  const {
    isOpen,
    isFinished,
    isLoading,
    isReapproval = false,
    onApprove,
    onClose,
  } = props;

  const handleApprove = () => {
    onApprove();
  };
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Modal
      className="approve-invoices-prompt-wrapper"
      isShowing={isOpen}
      onClose={handleClose}
      hideCloseButton
      styles={{
        modalWrapper: "approve-invoices-prompt-wrapper__modal-wrapper",
        headerWrapper: "approve-invoices-prompt-wrapper__header-wrapper",
        content: "approve-invoices-prompt-wrapper__content",
      }}
    >
      {isLoading && (
        <div className="approve-invoices-prompt-wrapper__loader-wrapper">
          <Loader />
        </div>
      )}
      {!isLoading && !isFinished && (
        <>
          <ConfirmationIcon className="approve-invoices-prompt-wrapper__confirmation-icon" />
          <h3 className="approve-invoices-prompt-wrapper__title">
            {isReapproval
              ? "Are you sure you want to reapprove this card?"
              : "Are you sure you want to approve all invoices?"}
          </h3>
          <div className="approve-invoices-prompt-wrapper__actions-wrapper">
            <button
              className="button-blue approve-invoices-prompt-wrapper__cancel-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="button-blue approve-invoices-prompt-wrapper__approve-button"
              onClick={handleApprove}
            >
              {isReapproval ? "Reapprove" : "Approve all"}
            </button>
          </div>
        </>
      )}
      {!isLoading && isFinished && (
        <>
          <CheckIcon className="approve-invoices-prompt-wrapper__check-icon" />
          <h3 className="approve-invoices-prompt-wrapper__title">
            Invoices are successfully {isReapproval ? "re" : ""}approved!
          </h3>
          <button
            className="button-blue approve-invoices-prompt-wrapper__done-button"
            onClick={handleClose}
          >
            Done
          </button>
        </>
      )}
    </Modal>
  );
};

export default ApproveInvoicesPrompt;
