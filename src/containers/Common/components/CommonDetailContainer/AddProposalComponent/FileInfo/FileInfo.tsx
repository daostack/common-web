import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import TrashIcon from "@/shared/icons/trash.icon";
import { DocInfo } from "@/shared/models";
import "./index.scss";

interface FileInfoProps {
  className?: string;
  file: File | DocInfo;
  onDelete: () => void;
}

const FileInfo: FC<FileInfoProps> = ({ className, file, onDelete }) => {
  return (
    <div className={classNames("bank-account-file-info-wrapper", className)}>
      <span className="bank-account-file-info-wrapper__text">{file.name}</span>
      <ButtonIcon onClick={onDelete}>
        <TrashIcon className="bank-account-file-info-wrapper__icon" />
      </ButtonIcon>
    </div>
  );
};

export default FileInfo;
