import React, { ChangeEvent, useState } from "react";
import { Loader, Button } from "@/shared/components";
import { DiscussionMessage } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { useDispatch } from "react-redux";
import { updateDiscussionMessage } from "@/containers/Common/store/actions";
import { useNotification } from "@/shared/hooks";
import "./edit-message-input.scss";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
}

export default function EditMessageInput({ discussionMessage, onClose }: Props) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [message, setMessage] = useState(discussionMessage.text);
  const [isLoading, setLoading] = useState(false);

  const updateMessage = () => {
    setLoading(true);
    dispatch(
      updateDiscussionMessage.request({
        payload: {
          discussionMessageId: discussionMessage.id,
          ownerId: discussionMessage.ownerId,
          text: message,
        },
        discussionId: discussionMessage.discussionId,
        callback(isSucceed) {
          if (isSucceed) {
            onClose();
          } else {
            notify("Something went wrong");
          }
          setLoading(false);
        },
      }),
    );
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <div className="edit-message-input">
      <div className="edit-message-input__owner-name">{getUserName(discussionMessage.owner)}</div>
      <textarea className="edit-message-input__input" value={message} onChange={handleChangeMessage} />
      <div className="edit-message-input__button-container">
        <Button
          disabled={isLoading}
          onClick={onClose}
          className="edit-message-input__button-container__button edit-message-input__button-container__cancel"
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={updateMessage}
          className="edit-message-input__button-container__button edit-message-input__button-container__save"
        >
          {isLoading ? <Loader className="edit-message-input__button-container__save__loader" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
