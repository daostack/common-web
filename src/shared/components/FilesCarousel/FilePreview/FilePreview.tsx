import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import DownloadIcon from "../../../icons/download.icon";
import LeftArrowIcon from "../../../icons/leftArrow.icon";
import RightArrowIcon from "../../../icons/rightArrow.icon";
import ZoomOutIcon from "../../../icons/zoomOut.icon";
import ZoomInIcon from "../../../icons/zoomIn.icon";
import { saveByURL } from "../../../utils";
import { DocInfo } from "../../../models";
import { ButtonIcon } from "../../ButtonIcon";
import { Image } from "../../Image";
import "./index.scss";

interface FilePreviewProps {
  className?: string;
  doc: DocInfo;
  isZoomed: boolean;
  onLeftClick: () => void;
  onRightClick: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const FilePreview: FC<FilePreviewProps> = (props) => {
  const {
    className,
    doc,
    isZoomed,
    onLeftClick,
    onRightClick,
    onZoomIn,
    onZoomOut,
  } = props;
  const [hasError, setHasError] = useState(false);
  const isImage = doc.mimeType.startsWith("image/");

  const handleDownload = () => {
    saveByURL(doc.downloadURL, doc.name);
  };

  const handleImageError = () => {
    setHasError(true);
  };

  const imageClassName = "carousel-file-preview-wrapper__image";
  const generalFileClassName = classNames(
    imageClassName,
    "carousel-file-preview-wrapper__general-file"
  );

  useEffect(() => {
    setHasError(false);
  }, [doc.downloadURL]);

  return (
    <div className={classNames("carousel-file-preview-wrapper", className)}>
      <div className="carousel-file-preview-wrapper__content">
        {!isZoomed && (
          <ButtonIcon
            className="carousel-file-preview-wrapper__switch-icon-wrapper"
            onClick={onLeftClick}
          >
            <LeftArrowIcon className="carousel-file-preview-wrapper__icon carousel-file-preview-wrapper__switch-icon" />
          </ButtonIcon>
        )}
        <div className="carousel-file-preview-wrapper__image-wrapper">
          {isImage ? (
            <Image
              key={doc.downloadURL}
              className={imageClassName}
              src={doc.downloadURL}
              alt={doc.name}
              onError={handleImageError}
              placeholderElement={
                <div className={generalFileClassName}>
                  Error with file "{doc.name}"
                </div>
              }
            />
          ) : (
            <div className={generalFileClassName}>{doc.name}</div>
          )}
          {!hasError && (
            <div className="carousel-file-preview-wrapper__icons-wrapper">
              <ButtonIcon
                className="carousel-file-preview-wrapper__icon-wrapper"
                onClick={handleDownload}
              >
                <DownloadIcon className="carousel-file-preview-wrapper__icon" />
              </ButtonIcon>
              {isImage && (
                <ButtonIcon
                  className="carousel-file-preview-wrapper__icon-wrapper"
                  onClick={isZoomed ? onZoomOut : onZoomIn}
                >
                  {isZoomed ? (
                    <ZoomOutIcon className="carousel-file-preview-wrapper__icon" />
                  ) : (
                    <ZoomInIcon className="carousel-file-preview-wrapper__icon" />
                  )}
                </ButtonIcon>
              )}
            </div>
          )}
        </div>
        {!isZoomed && (
          <ButtonIcon
            className="carousel-file-preview-wrapper__switch-icon-wrapper"
            onClick={onRightClick}
          >
            <RightArrowIcon className="carousel-file-preview-wrapper__icon carousel-file-preview-wrapper__switch-icon" />
          </ButtonIcon>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
