import React, { useEffect, ReactNode } from "react";
import classNames from "classnames";
import "./index.scss";

interface Styles {
  previewImage?: string;
}

interface IProps {
  file: File;
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  styles?: Styles;
}

export default function FilePreview({
  file,
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
          src={URL.createObjectURL(file)}
          alt="preview"
        />
        {bottomContent}
      </div>
    </div>
  );
}
