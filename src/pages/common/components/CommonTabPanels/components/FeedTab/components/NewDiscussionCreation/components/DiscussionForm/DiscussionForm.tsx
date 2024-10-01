import React, { FC, useEffect, useRef } from "react";
import classNames from "classnames";
import {
  TextEditor,
  TextField,
  UploadFiles,
} from "@/shared/components/Form/Formik";
import { TextEditorSize } from "@/shared/ui-kit";
import { MAX_DISCUSSION_TITLE_LENGTH } from "../../constants";
import styles from "./DiscussionForm.module.scss";

interface DiscussionFormProps {
  className?: string;
  disabled?: boolean;
}

const DiscussionForm: FC<DiscussionFormProps> = (props) => {
  const { className, disabled = false } = props;

  const textEditorRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textEditorRef.current) {
      textEditorRef.current.focus();
    }
  }, []);

  return (
    <div className={classNames(styles.container, className)}>
      <TextField
        ref={textEditorRef}
        className={styles.field}
        id="discussionTitle"
        name="title"
        label="Discussion Title (required)"
        maxLength={MAX_DISCUSSION_TITLE_LENGTH}
        countAsHint
        disabled={disabled}
        styles={{
          labelWrapper: styles.textFieldLabelWrapper,
          hint: styles.textFieldHint,
          input: { default: styles.titleTextarea },
        }}
        isTextarea
        rows={3}
      />
      <TextEditor
        className={styles.field}
        name="content"
        label="Content"
        optional
        disabled={disabled}
        size={TextEditorSize.Auto}
      />
      <UploadFiles name="images" disabled={disabled} />
    </div>
  );
};

export default DiscussionForm;
