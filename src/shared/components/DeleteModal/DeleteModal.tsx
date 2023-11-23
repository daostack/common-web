import React, {
  FC,
  PropsWithChildren,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { deleteDiscussionMessage } from "@/pages/OldCommon/store/actions";
import { ChatService } from "@/services";
import { Loader } from "@/shared/components";
import { EntityTypes } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  Common,
  Discussion,
  DiscussionMessage,
  Proposal,
} from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { Modal } from "../Modal";
import "./index.scss";

interface ReportModalProps {
  isShowing: boolean;
  onClose: () => void;
  type: EntityTypes;
  linkText?: string;
  entity: DiscussionMessage | Discussion | Proposal | Common;
  isChatMessage: boolean;
  onDelete?: (entityId: string) => void;
}

const DeleteModal: FC<PropsWithChildren<ReportModalProps>> = (props) => {
  const {
    isShowing,
    onClose,
    type,
    entity,
    isChatMessage,
    onDelete: onDeleteOutside,
  } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [isLoading, setLoading] = useState(false);

  const buttonTypeText = useMemo(() => {
    switch (type) {
      case EntityTypes.Common:
        return "common";
      case EntityTypes.Discussion:
        return "discussion";
      case EntityTypes.Proposal:
        return "proposal";
      case EntityTypes.DiscussionMessage:
      case EntityTypes.ProposalMessage:
        return "message";
      default:
        return "";
    }
  }, [type]);

  const onDeleteMessage = useCallback(
    (isProposalMessage: boolean): void => {
      setLoading(true);
      dispatch(
        deleteDiscussionMessage.request({
          payload: {
            discussionId: (entity as DiscussionMessage).discussionId,
            discussionMessageId: entity.id,
            isProposalMessage,
          },
          callback(error) {
            if (error) {
              setLoading(false);
              notify("Something went wrong");
              return;
            }

            setLoading(false);
            notify("The message has deleted!");
            onClose();
          },
        }),
      );
    },
    [entity],
  );

  const onChatMessageDelete = useCallback(async () => {
    setLoading(true);

    try {
      await ChatService.deleteChatMessage(entity.id);
      onDeleteOutside?.(entity.id);
      setLoading(false);
      notify("The message has deleted!");
      onClose();
    } catch (err) {
      setLoading(false);
      notify("Something went wrong");
    }
  }, [entity.id, onDeleteOutside]);

  const onDelete = useCallback(() => {
    if (isChatMessage) {
      onChatMessageDelete();
      return;
    }

    // TODO: Add other entities
    switch (type) {
      case EntityTypes.DiscussionMessage: {
        onDeleteMessage(false);
        break;
      }
      case EntityTypes.ProposalMessage: {
        onDeleteMessage(true);
        break;
      }
      default:
        break;
    }
  }, [entity, type, dispatch, isChatMessage, onChatMessageDelete]);

  return (
    <Modal
      className="delete-modal"
      isShowing={isShowing}
      onClose={onClose}
      title="Are you sure?"
      styles={{
        header: "delete-modal__header",
        content: "delete-modal__content",
      }}
    >
      <p className="delete-modal__title">This action cannot be reverted</p>
      <div className="delete-modal__button-container">
        <Button
          disabled={isLoading}
          className="delete-modal__button-container__button delete-modal__button-container__cancel"
          onClick={onClose}
          variant={ButtonVariant.OutlineDarkPink}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className="delete-modal__button-container__button delete-modal__button-container__send"
          onClick={onDelete}
          variant={ButtonVariant.PrimaryPink}
        >
          {isLoading ? (
            <Loader className="delete-modal__button-container__send__loader" />
          ) : (
            `Delete ${buttonTypeText}`
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
