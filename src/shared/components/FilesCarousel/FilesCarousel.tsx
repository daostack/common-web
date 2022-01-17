import React, { FC, useEffect } from "react";
import CloseIcon from "../../../shared/icons/close.icon";
import DownloadIcon from "../../../shared/icons/download.icon";
import "./index.scss";

interface FilesCarouselProps {
  // fileName: string;
  // mimeType: string;
  // downloadURL: string;
}

const FilesCarousel: FC<FilesCarouselProps> = (props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "initial";
    };
  }, []);

  return (
    <div className="files-carousel-wrapper">
      <div className="files-carousel-wrapper__overlay" />
      <div className="files-carousel-wrapper__content">
        {/*<div className="files-carousel-wrapper__top-content">*/}
        {/*  Top Content*/}
        {/*</div>*/}
        <div className="files-carousel-wrapper__preview-wrapper">
          <div className="files-carousel-wrapper__preview-image-wrapper">
            <img
              className="files-carousel-wrapper__preview-image"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/ReceiptSwiss.jpg/170px-ReceiptSwiss.jpg"
              alt="alt"
            />
            <div className="files-carousel-wrapper__preview-image-icons-wrapper">
              <DownloadIcon className="files-carousel-wrapper__icon" />
              <DownloadIcon className="files-carousel-wrapper__icon" />
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
