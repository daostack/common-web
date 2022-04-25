import React, { useEffect, FC } from "react";
import CloseIcon from "@/shared/icons/close.icon";
import { DocInfo } from "@/shared/models";
import { ButtonIcon } from "../ButtonIcon";
import { FilePreview as BaseFilePreview } from "../FilesCarousel/FilePreview";
import "./index.scss";

interface FilePreviewProps {
  doc: DocInfo | File;
  onClose: () => void;
}

const FilePreview: FC<FilePreviewProps> = (props) => {
  const { doc, onClose } = props;

  useEffect(() => {
    const initialOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = initialOverflow;
    };
  }, []);

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-wrapper__overlay" />
      <div className="file-preview-wrapper__content">
        <BaseFilePreview
          className="file-preview-wrapper__file-preview"
          doc={doc}
          isZoomed
          shouldHideSwitchActions
        />
        <ButtonIcon onClick={onClose}>
          <CloseIcon
            className="file-preview-wrapper__close-icon"
            fill="currentColor"
          />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default FilePreview;
