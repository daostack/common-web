import React, { FC, MouseEventHandler } from "react";
import classNames from "classnames";
import { ButtonIcon, ButtonLink } from "@/shared/components";
import TrashIcon from "@/shared/icons/trash.icon";
import { DocInfo } from "@/shared/models";
import "./index.scss";

interface FileInfoProps {
  className?: string;
  file: File | DocInfo;
  onClick?: () => void;
  onDelete: () => void;
}

const FileInfo: FC<FileInfoProps> = ({
  className,
  file,
  onClick,
  onDelete,
}) => {
  const handleDeleteClick: MouseEventHandler = (event) => {
    event.stopPropagation();
    onDelete();
  };

  return (
    <ButtonLink
      className={classNames("bank-account-file-info-wrapper", className)}
      onClick={onClick}
    >
      <span className="bank-account-file-info-wrapper__text">{file.name}</span>
      <ButtonIcon onClick={handleDeleteClick}>
        <TrashIcon className="bank-account-file-info-wrapper__icon" />
      </ButtonIcon>
    </ButtonLink>
  );
};

export default FileInfo;
