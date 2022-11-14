import React, { useEffect, ReactNode, useCallback, useMemo } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import classNames from "classnames";
import { MimePrefixes, MimeTypes } from "@/shared/constants/mimeTypes";
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
  topContent?: ReactNode;
  bottomContent?: ReactNode;
  fileType: string;
  styles?: Styles;
}

export default function FilePreview({
  fileURL,
  fileName,
  fileType,
  topContent,
  bottomContent,
  styles,
}: IProps) {
  const isImage = useMemo(
    () => fileType.startsWith(MimePrefixes.image),
    [fileType],
  );

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
        styles?.previewImage?.generalFile,
      )]: !isImage,
    },
    styles?.previewImage?.default,
  );

  const Preview = useCallback(() => {
    if (isImage) {
      return (
        <img className={previewImageClassName} src={fileURL} alt={fileName} />
      );
    } else if (fileType === MimeTypes.pdf) {
      return (
        <Document className="preview-pdf" file={fileURL}>
          <Page pageNumber={1} />
        </Document>
      );
    }

    return <div className={previewImageClassName}>{fileName}</div>;
  }, [fileURL, fileName, isImage]);

  return (
    <div className="file-preview-wrapper">
      <div className="file-preview-overlay" />
      <div className="content">
        {topContent}
        <Preview />
        {bottomContent}
      </div>
    </div>
  );
}
