import React, { useCallback, useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { ButtonIcon, Image } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import { getScreenSize } from "@/shared/store/selectors";
import { getCommonExampleImageURL } from "@/shared/utils";
import { GalleryButton } from "../GalleryButton";
import "./index.scss";

const EXAMPLE_IMAGES = Array(8)
  .fill(null)
  .map((item, index) => getCommonExampleImageURL(index + 1));

interface CommonImageSliderProps {
  className?: string;
  commonName: string;
  tagline?: string;
  initialImage: string | File | null;
  onImageChange: (image: string | File) => void;
}

const CommonImageSlider: FC<CommonImageSliderProps> = (props) => {
  const { commonName, tagline, initialImage, onImageChange } = props;
  const [swiperRef, setSwiperRef] = useState<SwiperClass | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(() =>
    !initialImage || typeof initialImage === "string" ? null : initialImage
  );
  const [isInitialSlideSet, setIsInitialSlideSet] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const className = classNames(
    "create-common-review-image-slider",
    props.className
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperClass) => {
      const imageURL = EXAMPLE_IMAGES[swiper.activeIndex];

      if (imageURL) {
        onImageChange(imageURL);
      }
    },
    [onImageChange]
  );

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

  const handleImageSelect = useCallback((file: File | null) => {
    setSelectedFile(file);
    onImageChange(file || EXAMPLE_IMAGES[0]);
  }, [onImageChange]);

  const renderTextWrapper = (shouldHideHint = false) => (
    <div className="create-common-review-image-slider__text-wrapper">
      {shouldHideHint ? (
        <div />
      ) : (
        <span className="create-common-review-image-slider__hint-text">
          Select or upload a cover image
        </span>
      )}
      {isMobileView && (
        <div className="create-common-review-image-slider__common-info-wrapper">
          <h4 className="create-common-review-image-slider__common-name">
            {commonName}
          </h4>
          {tagline && (
            <p className="create-common-review-image-slider__hint-text">
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (isInitialSlideSet || !swiperRef) {
      return;
    }

    setIsInitialSlideSet(true);

    if (!initialImage) {
      onImageChange(EXAMPLE_IMAGES[0]);
      return;
    }
    if (typeof initialImage !== "string") {
      return;
    }

    const index = EXAMPLE_IMAGES.indexOf(initialImage);

    if (index >= 0) {
      swiperRef.slideTo(index);
    } else {
      onImageChange(EXAMPLE_IMAGES[0]);
    }
  }, [isInitialSlideSet, onImageChange, initialImage, swiperRef]);

  return (
    <div className={className}>
      {!selectedFile && (
        <>
          <Swiper onSwiper={setSwiperRef} onSlideChange={handleSlideChange}>
            {EXAMPLE_IMAGES.map((imageURL, index) => (
              <SwiperSlide
                key={index}
                className="create-common-review-image-slider__slide"
              >
                <Image
                  className="create-common-review-image-slider__image"
                  src={imageURL}
                  alt={`Common example image #${index + 1}`}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <ButtonIcon
            className="create-common-review-image-slider__left-arrow-wrapper"
            disabled={swiperRef?.isBeginning}
            onClick={handleLeftClick}
          >
            <LeftArrowIcon className="create-common-review-image-slider__arrow-icon" />
          </ButtonIcon>
          <ButtonIcon
            className="create-common-review-image-slider__right-arrow-wrapper"
            disabled={swiperRef?.isEnd}
            onClick={handleRightClick}
          >
            <RightArrowIcon className="create-common-review-image-slider__arrow-icon" />
          </ButtonIcon>
          {renderTextWrapper()}
        </>
      )}
      {selectedFile && (
        <>
          <Image
            className="create-common-review-image-slider__image"
            src={URL.createObjectURL(selectedFile)}
            alt={selectedFile.name}
          />
          {renderTextWrapper(true)}
        </>
      )}
      <GalleryButton
        className="create-common-review-image-slider__gallery-button"
        onImageSelect={handleImageSelect}
        ariaLabel="Select common image"
        shouldDeleteFile={Boolean(selectedFile)}
      />
    </div>
  );
};

export default CommonImageSlider;
