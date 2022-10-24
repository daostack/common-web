import React, { FC, PropsWithChildren, useState, useCallback } from "react";
import { Colors, EntityTypes } from "@/shared/constants";
import { Loader, Button } from "@/shared/components";
import { Modal } from "../Modal";
import "./index.scss";
import { useNotification } from "@/shared/hooks";
import { useDispatch } from "react-redux";
import { Common, Discussion, DiscussionMessage, Proposal } from "@/shared/models";
import { deleteDiscussionMessage } from "@/containers/Common/store/actions";

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

  const onDelete = useCallback(() => {
    // TODO: Add other entities
    switch (type) {
      case EntityTypes.DiscussionMessage: {
        setLoading(true);
        dispatch(
          deleteDiscussionMessage.request({
            payload: {
              discussionId: (entity as DiscussionMessage).discussionId,
              discussionMessageId: entity.id,
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
          {isLoading ? <Loader className="delete-modal__button-container__send__loader" /> : "Delete"}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteModal;
