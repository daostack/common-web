import React, { FC } from "react";
import classNames from "classnames";
import { TextEditor, TextField } from "@/shared/components/Form/Formik";
import { MAX_DISCUSSION_TITLE_LENGTH } from "../../constants";
import styles from "./DiscussionForm.module.scss";

interface DiscussionFormProps {
  className?: string;
}

const DiscussionForm: FC<DiscussionFormProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <TextField
        className={styles.field}
        id="discussionTitle"
        name="title"
        label="Discussion Title"
        maxLength={MAX_DISCUSSION_TITLE_LENGTH}
        countAsHint
        styles={{
          labelWrapper: styles.textFieldLabelWrapper,
          hint: styles.textFieldHint,
        }}
      />
      <TextEditor name="content" label="Content" optional />
    </div>
  );
};

export default DiscussionForm;
