import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import * as oldCommonActions from "@/pages/OldCommon/store/actions";
import { ChatService } from "@/services";
import { Loader } from "@/shared/components";
import { useNotification } from "@/shared/hooks";
import {
  CommonMember,
  checkIsUserDiscussionMessage,
  DiscussionMessage,
} from "@/shared/models";
import { BaseTextEditor, Button, ButtonVariant } from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { emptyFunction } from "@/shared/utils";
import styles from "./EditMessageInput.module.scss";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
  isProposalMessage: boolean;
  isChatMessage: boolean;
  commonMember: CommonMember | null;
}

export default function EditMessageInput({
  discussionMessage,
  onClose,
  isProposalMessage,
  isChatMessage,
  commonMember,
}: Props) {
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [message, setMessage] = useState(
    parseStringToTextEditorValue(discussionMessage.text),
  );
  const [isLoading, setLoading] = useState(false);
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers();

  useEffect(() => {
    if (discussionMessage.commonId) {
      fetchCommonMembers(discussionMessage.commonId);
    }
  }, [discussionMessage.commonId]);

  const updateDiscussionMessage = () => {
    if (!checkIsUserDiscussionMessage(discussionMessage)) {
      notify("Something went wrong");
      return;
    }
    setLoading(true);
    dispatch(
      oldCommonActions.updateDiscussionMessage.request({
        payload: {
          discussionMessageId: discussionMessage.id,
          ownerId: discussionMessage.ownerId,
          text: JSON.stringify(message),
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

  const updateChatMessage = async () => {
    setLoading(true);

    try {
      const updatedMessage = await ChatService.updateChatMessage({
        chatMessageId: discussionMessage.id,
        text: JSON.stringify(message),
      });
      onClose();
    } catch (err) {
      notify("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = () => {
    if (isChatMessage) {
      updateChatMessage();
    } else {
      updateDiscussionMessage();
    }
  };

  const users = useMemo(() => {
    return commonMembers
      .filter((member) => member.userId !== commonMember?.userId)
      .map(({ user }) => user);
  }, [commonMember, commonMembers]);

  return (
    <div className={styles.container}>
      <BaseTextEditor
        className={styles.input}
        emojiPickerContainerClassName={styles.pickerContainer}
        emojiContainerClassName={styles.emojiContainer}
        value={message}
        onChange={setMessage}
        users={users}
        shouldReinitializeEditor={false}
        onClearFinished={emptyFunction}
      />

      <div className={styles.buttonContainer}>
        <Button
          variant={ButtonVariant.OutlineDarkPink}
          disabled={isLoading}
          onClick={onClose}
          className={classNames(styles.button, styles.cancelButton)}
        >
          Cancel
        </Button>
        <Button
          variant={ButtonVariant.PrimaryPink}
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
