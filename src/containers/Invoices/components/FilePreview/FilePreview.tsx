import React, { useEffect, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";

interface Styles {
  previewImage?: {
    default?: string;
    generalFile?: string;
  };
}

interface IProps {
  fileURL: string;
  fileName: string;
  isImage: boolean;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  styles?: Styles;
}

export default function FilePreview({
  fileURL,
  fileName,
  isImage,
  topContent,
  bottomContent,
  styles,
}: IProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  const previewImageClassName = classNames(
    "preview-image",
    {
      [classNames(
        "preview-image--general-file",
        styles?.previewImage?.generalFile
      )]: !isImage,
    },
    styles?.previewImage?.default
  );

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        {topContent}
        {isImage ? (
          <img className={previewImageClassName} src={fileURL} alt={fileName} />
        ) : (
          <div className={previewImageClassName}>{fileName}</div>
        )}
        {bottomContent}
      </div>
    </div>
  );
}
