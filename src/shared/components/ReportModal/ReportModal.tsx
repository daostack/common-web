import React, {
  FC,
  PropsWithChildren,
  useState,
  ChangeEvent,
  useCallback,
} from "react";
import { Colors, EntityTypes } from "@/shared/constants";
import { Loader, Button } from "@/shared/components";
import { createReport } from "@/containers/Common/store/actions";
import { Modal } from "../Modal";
import "./index.scss";
import { useNotification } from "@/shared/hooks";
import { useDispatch } from "react-redux";
import {
  Discussion,
  DiscussionMessage,
  Proposal,
  Common,
} from "@/shared/models";
import { subscribeToMessageRefresh } from "@/containers/Common/store/saga";

interface ReportModalProps {
  isShowing: boolean;
  onClose: () => void;
  type: EntityTypes;
  linkText?: string;
  entity: Common | Proposal | Discussion | DiscussionMessage;
  userId: string;
}

const ReportModal: FC<PropsWithChildren<ReportModalProps>> = (props) => {
  const { isShowing, onClose, type, entity, userId } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const sendReportOnMessage = useCallback(
    (isProposalMessage: boolean) => {
      const discussionId = (entity as DiscussionMessage).discussionId;
      setLoading(true);
      dispatch(
        createReport.request({
          payload: {
            moderationData: {
              moderatorNote: message,
              reasons: message,
              itemId: entity.id,
            },
            type,
            userId,
          },
          discussionId,
          *callback(isSucceed) {
            if (!isSucceed) {
              setLoading(false);
              notify("Something went wrong");
              return;
            }

            yield subscribeToMessageRefresh(discussionId, isProposalMessage);
            setLoading(false);
            setMessage("");
            notify("Report was sent");
            onClose();
          },
        }),
      );
    },
    [message, userId, type, entity],
  );

  const sendReport = useCallback((): void => {
    // TODO: Add other entities
    switch (type) {
      case EntityTypes.DiscussionMessage: {
        sendReportOnMessage(false);
        break;
      }
      case EntityTypes.ProposalMessage: {
        sendReportOnMessage(true);
        break;
      }
    }
  }, [message, entity, type, userId, dispatch]);

  const handleChangeMessage = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
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
      <textarea
        className="report-modal__input"
        value={message}
        onChange={handleChangeMessage}
      />
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
          {isLoading ? (
            <Loader className="report-modal__button-container__send__loader" />
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default ReportModal;
