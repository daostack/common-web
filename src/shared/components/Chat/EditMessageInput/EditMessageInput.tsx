import React, { useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { updateDiscussionMessage } from "@/pages/OldCommon/store/actions";
import { Loader, Button } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import { DiscussionMessage } from "@/shared/models";
import { TextEditor, TextEditorValue } from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { getUserName } from "@/shared/utils";
import styles from "./EditMessageInput.module.scss";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
  isProposalMessage: boolean;
}

export default function EditMessageInput({
  discussionMessage,
  onClose,
  isProposalMessage,
}: Props) {
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
        isProposalMessage,
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

  const handleChangeMessage = (value: TextEditorValue): void => {
    setMessage(JSON.stringify(value));
  };

  return (
    <div className={styles.container}>
      <div className={styles.ownerName}>
        {getUserName(discussionMessage.owner)}
      </div>

      <TextEditor
        className={styles.input}
        value={parseStringToTextEditorValue(message)}
        onChange={(e) => handleChangeMessage(e)}
      />

      <div className={styles.buttonContainer}>
        <Button
          disabled={isLoading}
          onClick={onClose}
          className={classNames(styles.button, styles.cancelButton)}
        >
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={updateMessage}
          className={classNames(styles.button, styles.saveButton)}
        >
          {isLoading ? <Loader className={styles.loader} /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
