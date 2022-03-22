import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";

import { getScreenSize } from "../../../../../../shared/store/selectors";
import { ScreenSize } from "../../../../../../shared/constants";
import { ModalFooter } from "../../../../../../shared/components/Modal";
import "./index.scss";

interface IntroductionProps {
  setTitle: (title: string) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  onFinish: () => void;
}

interface SlideOptions {
  imageSrc: string;
  title: string;
  description: string;
}

const SLIDES: SlideOptions[] = [
  {
    imageSrc: "/assets/images/membership-request-introduce.svg",
    title: "Create a Common",
    description: "Collaborate on shared agendas by pooling funds and collectively making decisions.",
  },
  {
    imageSrc: "/assets/images/membership-request-funds.svg",
    title: "Invite members and pool funds",
    description: "Invite others to join your Common. Easily pool funds from all members and work together to advance your cause.",
  },
  {
    imageSrc: "/assets/images/membership-request-vote.svg",
    title: "Work as a collective",
    description: "All members get an equal vote and can take part in the shared effort.",
  },
  {
    imageSrc: "/assets/images/membership-request-membership.svg",
    title: "Harness the power of communities",
    description: "There‘s no limit to what we can achieve when working together. By getting everyone involved, more people will actively promote the cause.",
  },
];

export default function Introduction({ setTitle, setGoBackHandler, onFinish }: IntroductionProps) {
  const swiperRef = useRef<SwiperClass>();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [continueButtonText, setContinueButtonText] = useState("Continue");

  useEffect(() => {
    setTitle(isMobileView ? "New Common" : "Create a Common");
  }, [setTitle, isMobileView]);

  useEffect(() => {
    setGoBackHandler(null);
  }, [setGoBackHandler]);

  const handleSwiper = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
  }, [swiperRef]);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setContinueButtonText(swiper.isEnd ? "Get started" : "Continue");
  }, []);

  const handleContinueClick = useCallback(() => {
    if (!swiperRef.current) {
      return;
    }

    if (swiperRef.current.isEnd) {
      onFinish();
    } else {
      swiperRef.current.slideNext();
    }
  }, [swiperRef, onFinish]);

  return (
    <>
      <div className="create-common-introduction">
        <Swiper
          pagination={{ clickable: true, bulletActiveClass: "create-common-introduction__active-bullet" }}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.title}>
              <figure className="create-common-introduction__slide">
                <img
                  className="create-common-introduction__image"
                  src={slide.imageSrc}
                  alt={slide.title}
                />
                <figcaption className="create-common-introduction__slide-title">{slide.title}</figcaption>
                <figcaption className="create-common-introduction__slide-description">{slide.description}</figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <ModalFooter sticky>
        <div className="create-common-introduction__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            {continueButtonText}
          </button>
        </div>
      </ModalFooter>
    </>
  );
}
