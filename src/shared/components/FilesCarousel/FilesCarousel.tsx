import React, { useEffect, useState, FC } from "react";
import classNames from "classnames";
import CloseIcon from "../../icons/close.icon";
import DownloadIcon from "../../icons/download.icon";
import { DocInfo } from "../../models";
import { ButtonIcon } from "../ButtonIcon";
import { AllFilesCarousel } from "./AllFilesCarousel";
import "./index.scss";

interface FilesCarouselProps {
  payoutDocs: DocInfo[];
}

const FilesCarousel: FC<FilesCarouselProps> = (props) => {
  const { payoutDocs } = props;
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  const handleZoomIn = () => {
    setIsZoomed(true);
  };
  const handleZoomOut = () => {
    setIsZoomed(false);
  };

  return (
    <div className="files-carousel-wrapper">
      <div className="files-carousel-wrapper__overlay" />
      <div className="files-carousel-wrapper__content">
        {!isZoomed && (
          <AllFilesCarousel
            className="files-carousel-wrapper__top-content"
            payoutDocs={payoutDocs}
          />
        )}
        <div
          className={classNames("files-carousel-wrapper__preview-wrapper", {
            "files-carousel-wrapper__preview-wrapper--zoomed": isZoomed,
          })}
        >
          <div className="files-carousel-wrapper__preview-image-wrapper">
            <img
              className="files-carousel-wrapper__preview-image"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/170px-ReceiptSwiss.jpg"
              alt="alt"
            />
            <div className="files-carousel-wrapper__preview-image-icons-wrapper">
              <ButtonIcon className="files-carousel-wrapper__icon-wrapper">
                <DownloadIcon className="files-carousel-wrapper__icon" />
              </ButtonIcon>
              <ButtonIcon
                className="files-carousel-wrapper__icon-wrapper"
                onClick={isZoomed ? handleZoomOut : handleZoomIn}
              >
                <DownloadIcon className="files-carousel-wrapper__icon" />
              </ButtonIcon>
            </div>
          </div>
        </div>
        <CloseIcon
          className="files-carousel-wrapper__icon files-carousel-wrapper__icon--close"
          fill="currentColor"
        />
      </div>
    </div>
  );
};

export default FilesCarousel;
