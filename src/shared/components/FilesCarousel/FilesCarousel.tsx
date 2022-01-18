import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import CloseIcon from "../../icons/close.icon";
import DownloadIcon from "../../icons/download.icon";
import LeftArrowIcon from "../../icons/leftArrow.icon";
import RightArrowIcon from "../../icons/rightArrow.icon";
import ZoomInIcon from "../../icons/zoomIn.icon";
import ZoomOutIcon from "../../icons/zoomOut.icon";
import { DocInfo } from "../../models";
import { ButtonIcon } from "../ButtonIcon";
import { AllFilesCarousel } from "./AllFilesCarousel";
import "./index.scss";

interface FilesCarouselProps {
  payoutDocs: DocInfo[];
  defaultDocIndex?: number | null;
  onClose: () => void;
}

const FilesCarousel: FC<FilesCarouselProps> = (props) => {
  const { payoutDocs, defaultDocIndex, onClose } = props;
  const [currentDocIndex, setCurrentDocIndex] = useState<number | null>(
    defaultDocIndex ?? null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const currentDoc =
    (typeof currentDocIndex === "number" && payoutDocs[currentDocIndex]) ||
    null;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  const handleDocClick = (doc: DocInfo, index: number) => {
    setCurrentDocIndex(index);
  };

  const handleZoomIn = () => {
    setIsZoomed(true);
  };
  const handleZoomOut = () => {
    setIsZoomed(false);
  };
  const handleLeftClick = () => {
    if (currentDocIndex === null) {
      return;
    }

    const index = currentDocIndex - 1;
    setCurrentDocIndex(index < 0 ? payoutDocs.length - 1 : index);
  };
  const handleRightClick = () => {
    if (currentDocIndex === null) {
      return;
    }

    const index = currentDocIndex + 1;
    setCurrentDocIndex(index >= payoutDocs.length ? 0 : index);
  };

  return (
    <div className="files-carousel-wrapper">
      <div className="files-carousel-wrapper__overlay" />
      <div className="files-carousel-wrapper__content">
        {!isZoomed && (
          <AllFilesCarousel
            className="files-carousel-wrapper__top-content"
            payoutDocs={payoutDocs}
            currentDocIndex={currentDocIndex}
            onDocClick={handleDocClick}
          />
        )}
        {currentDoc && (
          <div
            className={classNames("files-carousel-wrapper__preview-wrapper", {
              "files-carousel-wrapper__preview-wrapper--zoomed": isZoomed,
            })}
          >
            <div className="files-carousel-wrapper__preview-wrapper-content">
              {!isZoomed && (
                <ButtonIcon
                  className="files-carousel-wrapper__preview-icon-wrapper"
                  onClick={handleLeftClick}
                >
                  <LeftArrowIcon className="files-carousel-wrapper__icon files-carousel-wrapper__preview-icon" />
                </ButtonIcon>
              )}
              <div className="files-carousel-wrapper__preview-image-wrapper">
                <img
                  className={classNames(
                    "files-carousel-wrapper__preview-image",
                    {
                      "files-carousel-wrapper__preview-image--contain": isZoomed,
                    }
                  )}
                  src={currentDoc.downloadURL}
                  alt={currentDoc.name}
                />
                <div className="files-carousel-wrapper__preview-image-icons-wrapper">
                  <a
                    className="files-carousel-wrapper__icon-wrapper"
                    href={currentDoc.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <DownloadIcon className="files-carousel-wrapper__icon" />
                  </a>
                  <ButtonIcon
                    className="files-carousel-wrapper__icon-wrapper"
                    onClick={isZoomed ? handleZoomOut : handleZoomIn}
                  >
                    {isZoomed ? (
                      <ZoomOutIcon className="files-carousel-wrapper__icon" />
                    ) : (
                      <ZoomInIcon className="files-carousel-wrapper__icon" />
                    )}
                  </ButtonIcon>
                </div>
              </div>
              {!isZoomed && (
                <ButtonIcon
                  className="files-carousel-wrapper__preview-icon-wrapper"
                  onClick={handleRightClick}
                >
                  <RightArrowIcon className="files-carousel-wrapper__icon files-carousel-wrapper__preview-icon" />
                </ButtonIcon>
              )}
            </div>
          </div>
        )}
        <ButtonIcon onClick={onClose}>
          <CloseIcon
            className="files-carousel-wrapper__icon files-carousel-wrapper__icon--close"
            fill="currentColor"
          />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default FilesCarousel;
