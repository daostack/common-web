import React, { FC } from "react";
import { Close2Icon } from "@/shared/icons";
import { ButtonIcon } from "@/shared/ui-kit/ButtonIcon";
import styles from "./UploadedFile.module.scss";

interface UploadedFileProps {
  file: File | string;
  onRemove: () => void;
}

const UploadedFile: FC<UploadedFileProps> = (props) => {
  const { file, onRemove } = props;
  const imageSrc = typeof file === "string" ? file : URL.createObjectURL(file);

  return (
    <div className={styles.container}>
      <img className={styles.image} src={imageSrc} alt="Uploaded file" />
      <ButtonIcon className={styles.removeButton} onClick={onRemove}>
        <Close2Icon className={styles.removeButtonIcon} />
      </ButtonIcon>
    </div>
  );
};

export default UploadedFile;
