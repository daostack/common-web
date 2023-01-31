import React, { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { UploadFile } from "@/shared/interfaces";
import { Header, Trigger, UploadedFile } from "./components";
import { UploadFilesStyles } from "./types";
import styles from "./UploadFiles.module.scss";

export interface UploadFilesProps {
  className?: string;
  files?: UploadFile[];
  onChange: (files: UploadFile[]) => void;
  label?: string;
  hint?: string;
  optional?: boolean;
  maxImagesAmount?: number;
  disabled?: boolean;
  styles?: UploadFilesStyles;
}

const UploadFiles: FC<UploadFilesProps> = (props) => {
  const {
    className,
    files = [],
    onChange,
    label,
    hint,
    optional,
    maxImagesAmount,
    disabled = false,
    styles: outerStyles,
  } = props;

  const handleTriggerChange = (file: File) => {
    onChange(
      files.concat({
        id: uuidv4(),
        title: file.name,
        file,
      }),
    );
  };

  const handleFileRemove = (fileId: string) => {
    if (!disabled) {
      onChange(files.filter((file) => file.id !== fileId));
    }
  };

  return (
    <div className={className}>
      <Header
        label={label}
        hint={hint}
        optional={optional}
        styles={outerStyles}
      />
      <div className={styles.itemsWrapper}>
        {files.length > 0 &&
          files.map((file) => (
            <UploadedFile
              key={file.id}
              file={file.file}
              onRemove={() => handleFileRemove(file.id)}
            />
          ))}
        {(!maxImagesAmount || maxImagesAmount > files.length) && (
          <Trigger onChange={handleTriggerChange} disabled={disabled} />
        )}
      </div>
    </div>
  );
};

export default UploadFiles;
