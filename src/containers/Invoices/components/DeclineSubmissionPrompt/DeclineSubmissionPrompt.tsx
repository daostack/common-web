import React, { useCallback, useState, ChangeEventHandler, FC } from "react";
import { Modal } from "../../../../shared/components";
import { Input } from "../../../../shared/components/Form";
import "./index.scss";

interface DeclineSubmissionPromptProps {
  onContinue: (note: string) => void;
  onCancel: () => void;
}

const DeclineSubmissionPrompt: FC<DeclineSubmissionPromptProps> = (props) => {
  const { onContinue, onCancel } = props;
  const [note, setNote] = useState("");

  const handleNoteChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (event) => {
      setNote(event.target.value);
    },
    []
  );

  const handleDecline = useCallback(() => {
    onContinue(note);
  }, [onContinue, note]);

  return (
    <Modal
      className="decline-submission-prompt-wrapper"
      isShowing
      onClose={onCancel}
      title="Please add a note"
      hideCloseButton
    >
      <Input
        name="note"
        placeholder="Add Note"
        value={note}
        onChange={handleNoteChange}
        rows={3}
        isTextarea
      />
      <div className="decline-submission-prompt-wrapper__buttons-wrapper">
        <button
          className="button-blue decline-submission-prompt-wrapper__cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="button-blue decline-submission-prompt-wrapper__decline-button"
          disabled={!note}
          onClick={handleDecline}
        >
          Decline
        </button>
      </div>
    </Modal>
  );
};

export default DeclineSubmissionPrompt;
