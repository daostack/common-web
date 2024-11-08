import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import classNames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import throttle from "lodash/throttle";
import DownloadIcon from "../../../icons/download.icon";
import LeftArrowIcon from "../../../icons/leftArrow.icon";
import RightArrowIcon from "../../../icons/rightArrow.icon";
import { saveZip } from "../../../utils";
import { DocInfo } from "../../../models";
import { ButtonIcon } from "../../ButtonIcon";
import { InvoiceTile } from "../../InvoiceTile";
import { getSwiperConfig } from "./helpers";
import "./index.scss";

export interface AllFilesCarouselRef {
  slideTo: (index: number) => void;
}

interface AllFilesCarouselProps {
  className?: string;
  payoutDocs: DocInfo[];
  currentDocIndex?: number | null;
  initialDocIndex?: number | null;
  onDocClick?: (doc: DocInfo, index: number) => void;
}

const AllFilesCarousel: ForwardRefRenderFunction<
  AllFilesCarouselRef,
  AllFilesCarouselProps
> = (props, carouselRef) => {
  const {
    className,
    payoutDocs,
    currentDocIndex,
    initialDocIndex,
    onDocClick,
  } = props;
  const [
    swiperWrapperRef,
    setSwiperWrapperRef,
  ] = useState<HTMLDivElement | null>(null);
  const [{ isBeginning, isEnd }, setSlideState] = useState<{
    isBeginning: boolean;
    isEnd: boolean;
  }>({ isBeginning: false, isEnd: false });
  const [isInitialDocSet, setIsInitialDocSet] = useState(false);
  const [, setCurrentWindowWidth] = useState(window.innerWidth);
  const swiperRef = useRef<SwiperClass>();
  const swiperClientWidth = swiperWrapperRef?.clientWidth || 0;
  const swiperConfig = useMemo(
    () => getSwiperConfig(payoutDocs.length, swiperClientWidth),
    [payoutDocs.length, swiperClientWidth]
  );

  const handleSlideChange = useCallback(
    ({ isBeginning, isEnd }: SwiperClass) => {
      setSlideState((state) =>
        state.isBeginning === isBeginning && state.isEnd === isEnd
          ? state
          : {
              isBeginning,
              isEnd,
            }
      );
    },
    []
  );
  const handleSwiper = useCallback(
    (swiper: SwiperClass) => {
      swiperRef.current = swiper;
      handleSlideChange(swiper);
    },
    [handleSlideChange]
  );

  const handleLeftClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  const handleRightClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleDownloadAll = () => {
    const files = payoutDocs.map((doc) => ({
      url: doc.downloadURL,
      fileName: doc.name,
    }));

    saveZip("invoices.zip", files);
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setCurrentWindowWidth(window.innerWidth);
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      !isInitialDocSet &&
      swiperConfig.initialized &&
      typeof initialDocIndex === "number"
    ) {
      setIsInitialDocSet(true);
      swiperRef.current?.slideTo(initialDocIndex);
    }
  }, [isInitialDocSet, swiperConfig.initialized, initialDocIndex]);

  useImperativeHandle(
    carouselRef,
    () => ({
      slideTo: (index) => {
        swiperRef.current?.slideTo(index);
      },
    }),
    []
  );

  const contentWrapperClassName = classNames(
    "all-files-carousel-wrapper__content-wrapper",
    {
      "all-files-carousel-wrapper__content-wrapper--without-actions": false,
    }
  );

  return (
    <div className={classNames("all-files-carousel-wrapper", className)}>
      <div className="all-files-carousel-wrapper__header">
        <span>
          {payoutDocs.length}
          {` Invoice${payoutDocs.length === 1 ? "" : "s"}`}
        </span>
        <ButtonIcon
          className="all-files-carousel-wrapper__download-all"
          onClick={handleDownloadAll}
        >
          <DownloadIcon />
          Download all invoices
        </ButtonIcon>
      </div>
      <div className={contentWrapperClassName}>
        <ButtonIcon
          className={classNames("all-files-carousel-wrapper__button-icon", {
            "all-files-carousel-wrapper__button-icon--hidden": !swiperConfig.scrollable,
          })}
          onClick={handleLeftClick}
          disabled={!swiperConfig.scrollable || isBeginning}
        >
          <LeftArrowIcon className="all-files-carousel-wrapper__icon" />
        </ButtonIcon>
        <div
          className="all-files-carousel-wrapper__swiper-wrapper"
          ref={setSwiperWrapperRef}
        >
          <Swiper
            className="all-files-carousel-wrapper__swiper"
            slidesPerView={swiperConfig.slidesPerView}
            spaceBetween={swiperConfig.spaceBetween}
            longSwipes={false}
            onSwiper={handleSwiper}
            onSlideChange={handleSlideChange}
          >
            {payoutDocs.map((doc, index) => {
              const isActive = currentDocIndex === index;
              const className = classNames(
                "all-files-carousel-wrapper__invoice-tile",
                {
                  "all-files-carousel-wrapper__invoice-tile--active": isActive,
                }
              );
              const imageClassName = classNames(
                "all-files-carousel-wrapper__invoice-tile-image",
                {
                  "all-files-carousel-wrapper__invoice-tile-image--active": isActive,
                }
              );

              return (
                <SwiperSlide key={index}>
                  <InvoiceTile
                    className={className}
                    fileURL={doc.downloadURL}
                    fileName={doc.name}
                    isImage={doc.mimeType.startsWith("image/")}
                    styles={{
                      image: imageClassName,
                    }}
                    onClick={() => onDocClick && onDocClick(doc, index)}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <ButtonIcon
          className={classNames("all-files-carousel-wrapper__button-icon", {
            "all-files-carousel-wrapper__button-icon--hidden": !swiperConfig.scrollable,
          })}
          onClick={handleRightClick}
          disabled={!swiperConfig.scrollable || isEnd}
        >
          <RightArrowIcon className="all-files-carousel-wrapper__icon" />
        </ButtonIcon>
      </div>
    </div>
  );
};

export default forwardRef(AllFilesCarousel);
