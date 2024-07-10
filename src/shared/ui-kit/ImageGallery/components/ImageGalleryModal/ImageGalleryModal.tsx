import React, { FC, ReactNode, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { ButtonIcon, Image, Modal } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import { VideoEmbed } from "@/shared/ui-kit/VideoEmbed";
import "./ImageGalleryModal.scss";
import "swiper/components/pagination/pagination.min.css";

interface ImageGalleryProps {
  images: string[];
  preloaderSrc?: string;
  placeholderElement?: ReactNode;
  isShowing: boolean;
  onClose: () => void;
  videoSrc?: string;
  initialSlide?: number;
}

const ImageGalleryModal: FC<ImageGalleryProps> = (props) => {
  const { images, isShowing, onClose, videoSrc, initialSlide = 0 } = props;
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const isTabletView = useIsTabletView();

  const handleLeftClick = useCallback(() => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }

    if (videoSrc) {
      (document.getElementById("videoPlayer") as HTMLVideoElement)?.pause();
    }
  }, [swiperRef]);

  const handleRightClick = useCallback(() => {
    if (swiperRef) {
      swiperRef.slideNext();
    }

    if (videoSrc) {
      (document.getElementById("videoPlayer") as HTMLVideoElement)?.pause();
    }
  }, [swiperRef]);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      mobileFullScreen={isTabletView}
      className="image-gallery-modal"
    >
      <div className="container">
        <Swiper
          onSwiper={setSwiperRef}
          loop={true}
          pagination
          initialSlide={initialSlide}
          allowTouchMove={isTabletView}
        >
          {videoSrc && (
            <SwiperSlide key={videoSrc} className="slider-wrapper">
              <div className="video-container">
                <VideoEmbed videoSrc={videoSrc} />
              </div>
            </SwiperSlide>
          )}
          {images.map((imageURL, index) => (
            <SwiperSlide
              key={imageURL}
              className="slider-wrapper"
              onClick={() =>
                window.open(imageURL, "_blank", "noopener,noreferrer")
              }
            >
              <Image
                hasZoom
                className="slide-img"
                imageContainerClassName="image-container"
                src={imageURL}
                alt={`Common gallery image #${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        {!isTabletView && images.length > 1 && (
          <>
            <ButtonIcon
              className="arrow-wrapper-left"
              onClick={handleLeftClick}
            >
              <LeftArrowIcon className="arrow-icon" />
            </ButtonIcon>
            <ButtonIcon
              className="arrow-wrapper-right"
              onClick={handleRightClick}
            >
              <RightArrowIcon className="arrow-icon" />
            </ButtonIcon>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImageGalleryModal;
