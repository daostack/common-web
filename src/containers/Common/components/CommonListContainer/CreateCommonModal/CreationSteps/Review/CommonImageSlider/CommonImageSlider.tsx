import React, { useCallback, useRef, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { Image } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { getCommonExampleImageURL } from "@/shared/utils";
import { GalleryButton } from "../GalleryButton";
import "./index.scss";

const SLIDES = Array(8).fill(null);

interface CommonImageSliderProps {
  className?: string;
}

const CommonImageSlider: FC<CommonImageSliderProps> = (props) => {
  const {} = props;
  const swiperRef = useRef<SwiperClass>();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const className = classNames(
    "create-common-review-image-slider",
    props.className
  );

  const handleSwiper = useCallback(
    (swiper: SwiperClass) => {
      swiperRef.current = swiper;
    },
    [swiperRef]
  );

  const handleImageSelect = (file: File) => {
    console.log(file);
  };

  return (
    <div className={className}>
      <Swiper onSwiper={handleSwiper}>
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={index}>
            <Image
              className="create-common-review-image-slider__image"
              src={getCommonExampleImageURL(index + 1)}
              alt={`Common example image #${index + 1}`}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <GalleryButton
        className="create-common-review-image-slider__gallery-button"
        onImageSelect={handleImageSelect}
        ariaLabel="Select common image"
      />
    </div>
  );
};

export default CommonImageSlider;
