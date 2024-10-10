import React, { useEffect, useMemo, useState, useRef } from "react";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { Loader } from "@/shared/components";
import { CommonMember, DiscussionMessage } from "@/shared/models";
import {
  BaseTextEditor,
  Button,
  ButtonVariant,
  TextEditorSize,
  TextEditorValue,
} from "@/shared/ui-kit";
import { parseStringToTextEditorValue } from "@/shared/ui-kit/TextEditor/utils";
import { emptyFunction } from "@/shared/utils";
import styles from "./EditMessageInput.module.scss";

interface Props {
  discussionMessage: DiscussionMessage;
  onClose: () => void;
  commonMember: CommonMember | null;
  isLoading: boolean;
  updateMessage: (message: TextEditorValue) => void;
}

export default function EditMessageInput({
  discussionMessage,
  onClose,
  commonMember,
  isLoading,
  updateMessage,
}: Props) {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState(() =>
    parseStringToTextEditorValue(discussionMessage.text),
  );
  const { data: commonMembers, fetchCommonMembers } = useCommonMembers({
    commonId: discussionMessage.commonId,
  });

  const handleMessageUpdate = () => {
    updateMessage(message);
  };

  useEffect(() => {
    if (discussionMessage.commonId) {
      fetchCommonMembers();
    }
  }, [discussionMessage.commonId]);

  const users = useMemo(() => {
    return commonMembers
      .filter((member) => member.userId !== commonMember?.userId)
      .map(({ user }) => user);
  }, [commonMember, commonMembers]);

  return (
    <div ref={inputContainerRef} className={styles.container}>
      <BaseTextEditor
        className={styles.input}
        emojiPickerContainerClassName={styles.pickerContainer}
        emojiContainerClassName={styles.emojiContainer}
        value={message}
        onChange={setMessage}
        users={users}
        shouldReinitializeEditor={false}
        onClearFinished={emptyFunction}
        size={TextEditorSize.Auto}
        inputContainerRef={inputContainerRef}
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
          onClick={handleMessageUpdate}
          className={classNames(styles.button, styles.saveButton)}
        >
          {isLoading ? <Loader className={styles.loader} /> : "Save"}
        </Button>
      </div>
    </div>
  );
}
