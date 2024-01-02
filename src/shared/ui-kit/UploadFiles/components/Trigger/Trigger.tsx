import React, { ChangeEventHandler, FC } from "react";
import { useImageSizeCheck } from "@/shared/hooks";
import { UploadIcon } from "@/shared/icons";
import styles from "./Trigger.module.scss";

const ACCEPTED_EXTENSIONS = "image/*";

interface TriggerProps {
  onChange: (file: File) => void;
  text?: string;
  accept?: string;
  disabled?: boolean;
}

const Trigger: FC<TriggerProps> = (props) => {
  const {
    onChange,
    text = "Upload pictures",
    accept = ACCEPTED_EXTENSIONS,
    disabled = false,
  } = props;
  const { checkImageSize } = useImageSizeCheck();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file && checkImageSize(file.name, file.size)) {
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
        disabled={disabled}
      />
    </label>
  );
};

export default Trigger;
