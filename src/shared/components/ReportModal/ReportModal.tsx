import React, { FC, PropsWithChildren, useState, ChangeEvent } from "react";
import { Colors, ENTITY_TYPES } from "@/shared/constants";
import { Loader, Button } from "@/shared/components";
import { createReport } from "@/containers/Common/store/api";
import { Modal } from "../Modal";
import "./index.scss";
import { useNotification } from "@/shared/hooks";

interface ReportModalProps {
  isShowing: boolean;
  onClose: () => void;
  type: ENTITY_TYPES;
  linkText?: string;
  itemId: string;
  userId: string;
}

const ReportModal: FC<PropsWithChildren<ReportModalProps>> = (props) => {
  const { isShowing, onClose, type, itemId, userId } = props;
  const { notify } = useNotification();
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const sendReport = async (): Promise<void> => {
    try {
      setLoading(true);
      await createReport({
        moderationData: {
          moderatorNote: message,
          reasons: message,
          itemId,
        },
        type,
        userId,
      });
      setLoading(false);
      setMessage("");
      notify("Report was sent");
      onClose();
    } catch (error) {
      notify("Something went wrong");
    }
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <Modal
      className="report-modal"
      isShowing={isShowing}
      onClose={onClose}
      title="Report"
      closeColor={Colors.black}
      closeIconSize={20}
      styles={{
        header: "report-modal__header",
        content: "report-modal__content",
      }}
    >
      <p className="report-modal__title">Add your report</p>
      <textarea className="report-modal__input" value={message} onChange={handleChangeMessage} />
      <div className="report-modal__button-container">
        <Button
          disabled={isLoading}
          className="report-modal__button-container__button report-modal__button-container__cancel"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className="report-modal__button-container__button report-modal__button-container__send"
          onClick={sendReport}
        >
          {isLoading ? <Loader className="report-modal__button-container__send__loader" /> : "Save"}
        </Button>
      </div>
    </Modal>
  );
};

export default ReportModal;
