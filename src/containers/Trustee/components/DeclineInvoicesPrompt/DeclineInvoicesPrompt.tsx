import React, {
  useEffect,
  useState,
  ChangeEventHandler,
  FC,
  FocusEventHandler,
} from "react";
import { Modal } from "../../../../shared/components";
import { Input } from "../../../../shared/components/Form";
import "./index.scss";

interface DeclineInvoicesPromptProps {
  isOpen: boolean;
  onDecline: (note: string) => void;
  onClose: () => void;
}

const DeclineInvoicesPrompt: FC<DeclineInvoicesPromptProps> = (props) => {
  const { isOpen, onDecline, onClose } = props;
  const [note, setNote] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const error = isTouched && !note ? "Note is required" : "";

  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = () => {
    setIsTouched(true);
  };
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setNote(event.target.value);
  };
  const handleDecline = () => {
    if (!note) {
      setIsTouched(true);
      return;
    }

    onDecline(note);
  };

  useEffect(() => {
    if (!isOpen) {
      setNote("");
      setIsTouched(false);
    }
  }, [isOpen]);

  return (
    <Modal
      className="decline-invoices-prompt-wrapper"
      isShowing={isOpen}
      onClose={onClose}
      hideCloseButton
      styles={{
        modalWrapper: "decline-invoices-prompt-wrapper__modal-wrapper",
        headerWrapper: "decline-invoices-prompt-wrapper__header-wrapper",
        content: "decline-invoices-prompt-wrapper__content",
      }}
    >
      <h3 className="decline-invoices-prompt-wrapper__title">Decline Refund</h3>
      <p className="decline-invoices-prompt-wrapper__description">
        What is the reason for declining?
        <br />
        Please be specific as possible
      </p>
      <Input
        id="note"
        name="note"
        placeholder="Add Note"
        isTextarea
        rows={6}
        value={note}
        error={error}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="decline-invoices-prompt-wrapper__actions-wrapper">
        <button
          className="button-blue decline-invoices-prompt-wrapper__decline-button"
          onClick={handleDecline}
        >
          Decline Refund
        </button>
        <button
          className="button-blue decline-invoices-prompt-wrapper__cancel-button"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeclineInvoicesPrompt;
