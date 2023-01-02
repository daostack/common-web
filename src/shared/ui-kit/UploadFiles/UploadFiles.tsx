import React, { FC } from "react";
import { v4 as uuidv4 } from "uuid";
import { Trigger, UploadedFile } from "./components";
import styles from "./UploadFiles.module.scss";

export interface UploadFile {
  // id can be any string. it is just for correct displaying purposes
  id: string;
  file: File | string;
}

interface UploadFilesProps {
  className?: string;
  files?: UploadFile[];
  onChange: (files: UploadFile[]) => void;
}

const UploadFiles: FC<UploadFilesProps> = (props) => {
  const { className, files = [], onChange } = props;

  const handleTriggerChange = (file: File) => {
    onChange(
      files.concat({
        id: uuidv4(),
        file,
      }),
    );
  };

  const handleFileRemove = (fileId: string) => {
    onChange(files.filter((file) => file.id !== fileId));
  };

  return (
    <div className={className}>
      <div className={styles.itemsWrapper}>
        {files.length > 0 &&
          files.map((file) => (
            <UploadedFile
              key={file.id}
              file={file.file}
              onRemove={() => handleFileRemove(file.id)}
            />
          ))}
        <Trigger onChange={handleTriggerChange} />
      </div>
    </div>
  );
};

export default UploadFiles;
