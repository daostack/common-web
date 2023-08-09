import React, { FC } from "react";
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

  return (
    <div className={classNames(styles.container, className)}>
      <TextField
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
        }}
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
