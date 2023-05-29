import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { updateDiscussionMessage } from "@/pages/OldCommon/store/actions";
import { Loader, Button } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import { CommonMember, DiscussionMessage } from "@/shared/models";
import { BaseTextEditor } from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { emptyFunction, getUserName } from "@/shared/utils";
import styles from "./EditMessageInput.module.scss";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
  isProposalMessage: boolean;
  commonMember: CommonMember | null;
}

export default function EditMessageInput({
  discussionMessage,
  onClose,
  isProposalMessage,
  commonMember,
}: Props) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [message, setMessage] = useState(discussionMessage.text);
  const [isLoading, setLoading] = useState(false);
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();

  useEffect(() => {
    if (discussionMessage.commonId) {
      fetchCommonMembers(discussionMessage.commonId);
    }
  }, [discussionMessage.commonId]);

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

  const users = useMemo(() => {
    return commonMembers
      .filter((member) => member.userId !== commonMember?.userId)
      .map(({ user }) => user);
  }, [commonMember, commonMembers]);

  return (
    <div className={styles.container}>
      <div className={styles.ownerName}>
        {getUserName(discussionMessage.owner)}
      </div>

      <BaseTextEditor
        className={styles.input}
        value={parseStringToTextEditorValue(message)}
        onChange={(value) => setMessage(JSON.stringify(value))}
        users={users}
        shouldReinitializeEditor={false}
        onClearFinished={emptyFunction}
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
