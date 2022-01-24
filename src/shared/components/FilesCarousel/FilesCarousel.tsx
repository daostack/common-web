import React, { useEffect, useRef, useState, FC } from "react";
import classNames from "classnames";
import CloseIcon from "../../icons/close.icon";
import { DocInfo } from "../../models";
import { ButtonIcon } from "../ButtonIcon";
import { AllFilesCarousel, AllFilesCarouselRef } from "./AllFilesCarousel";
import { FilePreview } from "./FilePreview";
import "./index.scss";

interface FilesCarouselProps {
  payoutDocs: DocInfo[];
  defaultDocIndex?: number | null;
  onClose: () => void;
}

const FilesCarousel: FC<FilesCarouselProps> = (props) => {
  const { payoutDocs, defaultDocIndex, onClose } = props;
  const allFilesCarouselRef = useRef<AllFilesCarouselRef>(null);
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
    const nextIndex = index < 0 ? payoutDocs.length - 1 : index;
    setCurrentDocIndex(nextIndex);
    allFilesCarouselRef.current?.slideTo(nextIndex);
  };
  const handleRightClick = () => {
    if (currentDocIndex === null) {
      return;
    }

    const index = currentDocIndex + 1;
    const nextIndex = index >= payoutDocs.length ? 0 : index;
    setCurrentDocIndex(nextIndex);
    allFilesCarouselRef.current?.slideTo(nextIndex);
  };

  return (
    <div className="files-carousel-wrapper">
      <div className="files-carousel-wrapper__overlay" />
      <div
        className={classNames("files-carousel-wrapper__content", {
          "files-carousel-wrapper__content--zoomed": isZoomed,
        })}
      >
        {!isZoomed && (
          <AllFilesCarousel
            ref={allFilesCarouselRef}
            className="files-carousel-wrapper__top-content"
            payoutDocs={payoutDocs}
            currentDocIndex={currentDocIndex}
            initialDocIndex={currentDocIndex}
            onDocClick={handleDocClick}
          />
        )}
        {currentDoc && (
          <FilePreview
            className="files-carousel-wrapper__file-preview"
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
