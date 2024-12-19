import React, {
  FC,
  PropsWithChildren,
  useState,
  ChangeEvent,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { createReport } from "@/pages/OldCommon/store/actions";
import { subscribeToMessageRefresh } from "@/pages/OldCommon/store/saga";
import { Loader } from "@/shared/components";
import { EntityTypes } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  Discussion,
  DiscussionMessage,
  Proposal,
  Common,
} from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { emptyFunction } from "@/shared/utils";
import { Modal } from "../Modal";
import "./index.scss";

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
            type: EntityTypes.DiscussionMessage,
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

  const sendReportOnEntity = useCallback(() => {
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
        callback(isSucceed) {
          if (!isSucceed) {
            setLoading(false);
            notify("Something went wrong");
            return;
          }
          setLoading(false);
          setMessage("");
          notify("Report was sent");
          onClose();
        },
      }),
    );
  }, [message, userId, type, entity]);

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
      case EntityTypes.Discussion:
      case EntityTypes.Proposal: {
        sendReportOnEntity();
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
      onClose={isLoading ? emptyFunction : onClose}
      hideCloseButton={isLoading}
      title="Report"
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
        disabled={isLoading}
      />
      <div className="report-modal__button-container">
        <Button
          disabled={isLoading}
          className="report-modal__button-container__button report-modal__button-container__cancel"
          onClick={onClose}
          variant={ButtonVariant.OutlineDarkPink}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading || !message}
          className="report-modal__button-container__button report-modal__button-container__send"
          onClick={sendReport}
          variant={ButtonVariant.PrimaryPink}
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

export default React.memo(ReportModal);
