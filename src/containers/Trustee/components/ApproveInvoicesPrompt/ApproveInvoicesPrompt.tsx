import React, { FC } from "react";
import { Loader, Modal } from "../../../../shared/components";
import CheckIcon from "../../../../shared/icons/check.icon";
import "./index.scss";

interface ApproveInvoicesPromptProps {
  isOpen: boolean;
  isApproved: boolean;
  isLoading: boolean;
  onApprove: () => void;
  onClose: () => void;
}

const ApproveInvoicesPrompt: FC<ApproveInvoicesPromptProps> = (props) => {
  const { isOpen, isApproved, isLoading, onApprove, onClose } = props;

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
      {!isLoading && !isApproved && (
        <>
          <CheckIcon
            className="approve-invoices-prompt-wrapper__check-icon"
            fill="currentColor"
          />
          <h3 className="approve-invoices-prompt-wrapper__title">
            Are you sure you want to approve all invoices
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
              onClick={onApprove}
            >
              Approve all
            </button>
          </div>
        </>
      )}
      {!isLoading && isApproved && (
        <>
          <CheckIcon
            className="approve-invoices-prompt-wrapper__check-icon"
            fill="currentColor"
          />
          <h3 className="approve-invoices-prompt-wrapper__title">
            Invoices are successfully approved!
          </h3>
          <div className="approve-invoices-prompt-wrapper__actions-wrapper">
            <button
              className="button-blue approve-invoices-prompt-wrapper__done-button"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ApproveInvoicesPrompt;
