import React, { FC, ReactNode, useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { ButtonIcon, Image, Modal } from "@/shared/components";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import "./ImageGalleryModal.scss";
import "swiper/components/pagination/pagination.min.css";

interface ImageGalleryProps {
  images: string[];
  preloaderSrc?: string;
  placeholderElement?: ReactNode;
  isShowing: boolean;
  onClose: () => void;
}

const ImageGalleryModal: FC<ImageGalleryProps> = (props) => {
  const { images, isShowing, onClose } = props;
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);

  const handleLeftClick = useCallback(() => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  }, [swiperRef]);

  const handleRightClick = useCallback(() => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  }, [swiperRef]);

  return (
    <Modal isShowing={isShowing} onClose={onClose}>
      <div className="container">
        <Swiper onSwiper={setSwiperRef} loop={true} pagination>
          {images.map((imageURL, index) => (
            <SwiperSlide key={index} className="slider-wrapper">
              <Image
                className="slide-img"
                src={imageURL}
                alt={`Common gallery image #${index + 1}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <ButtonIcon className="arrow-wrapper-left" onClick={handleLeftClick}>
          <LeftArrowIcon className="arrow-icon" />
        </ButtonIcon>
        <ButtonIcon className="arrow-wrapper-right" onClick={handleRightClick}>
          <RightArrowIcon className="arrow-icon" />
        </ButtonIcon>
      </div>
    </Modal>
  );
};

export default ImageGalleryModal;
