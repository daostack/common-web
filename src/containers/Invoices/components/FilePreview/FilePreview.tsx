import React, { useEffect, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";

interface Styles {
  previewImage?: string;
}

interface IProps {
  fileURL: string;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  styles?: Styles;
}

export default function FilePreview({
  fileURL,
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
    styles?.previewImage
  );

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        {topContent}
        <img
          className={previewImageClassName}
          src={fileURL}
          alt="preview"
        />
        {bottomContent}
      </div>
    </div>
  );
}
