import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { deleteDiscussionMessage } from "@/pages/OldCommon/store/actions";
import { Loader, Button } from "@/shared/components";
import { Colors, EntityTypes } from "@/shared/constants";
import { useNotification } from "@/shared/hooks";
import {
  Common,
  Discussion,
  DiscussionMessage,
  Proposal,
} from "@/shared/models";
import { Modal } from "../Modal";
import "./index.scss";

interface ReportModalProps {
  isShowing: boolean;
  onClose: () => void;
  type: EntityTypes;
  linkText?: string;
  entity: DiscussionMessage | Discussion | Proposal | Common;
}

const DeleteModal: FC<PropsWithChildren<ReportModalProps>> = (props) => {
  const { isShowing, onClose, type, entity } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [isLoading, setLoading] = useState(false);

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

  const onDelete = useCallback(() => {
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
    }
  }, [entity, type, dispatch]);

  return (
    <Modal
      className="delete-modal"
      isShowing={isShowing}
      onClose={onClose}
      title="Delete"
      closeColor={Colors.black}
      closeIconSize={20}
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
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          className="delete-modal__button-container__button delete-modal__button-container__send"
          onClick={onDelete}
        >
          {isLoading ? (
            <Loader className="delete-modal__button-container__send__loader" />
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
