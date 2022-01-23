import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import CloseIcon from "../../icons/close.icon";
import { DocInfo } from "../../models";
import { ButtonIcon } from "../ButtonIcon";
import { AllFilesCarousel } from "./AllFilesCarousel";
import { FilePreview } from "./FilePreview";
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
          <FilePreview
            className={classNames("files-carousel-wrapper__file-preview", {
              "files-carousel-wrapper__file-preview--zoomed": isZoomed,
            })}
            doc={currentDoc}
            isZoomed={isZoomed}
            onLeftClick={handleLeftClick}
            onRightClick={handleRightClick}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        )}
        <ButtonIcon onClick={onClose}>
          <CloseIcon
            className="files-carousel-wrapper__close-icon"
            fill="currentColor"
          />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default FilesCarousel;
