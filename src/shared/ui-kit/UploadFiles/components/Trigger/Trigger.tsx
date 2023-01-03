import React, { ChangeEventHandler, FC } from "react";
import { UploadIcon } from "@/shared/icons";
import styles from "./Trigger.module.scss";

const ACCEPTED_EXTENSIONS = "image/*";

interface TriggerProps {
  onChange: (file: File) => void;
  text?: string;
  accept?: string;
}

const Trigger: FC<TriggerProps> = (props) => {
  const {
    onChange,
    text = "Upload pictures",
    accept = ACCEPTED_EXTENSIONS,
  } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      onChange(file);
    }

    event.target.value = "";
  };

  return (
    <label className={styles.container}>
      <UploadIcon className={styles.uploadIcon} />
      <span className={styles.text}>{text}</span>
      <input
        className={styles.input}
        type="file"
        onChange={handleChange}
        accept={accept}
      />
    </label>
  );
};

export default Trigger;
