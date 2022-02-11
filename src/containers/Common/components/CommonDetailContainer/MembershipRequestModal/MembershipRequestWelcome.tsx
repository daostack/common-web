import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperClass from "swiper/types/swiper-class";
import { Button } from "../../../../../shared/components";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { ModalFooter } from "../../../../../shared/components/Modal";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestWelcome(props: IStageProps) {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const { userData, setUserData } = props;
  const swiperRef = useRef<SwiperClass>();
  const [continueButtonText, setContinueButtonText] = useState(isMobileView ? "Continue" : "Request to join");

  const handleSwiper = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    if (isMobileView) {
      setContinueButtonText(swiper.isEnd ? "Request to join" : "Continue");
    }
  }, [isMobileView]);

  const handleContinueClick = useCallback(() => {
    if (!isMobileView || !swiperRef.current) {
      setUserData({ ...userData, stage: 1 });
      return;
    }

    if (swiperRef.current.isEnd) {
      setUserData({ ...userData, stage: 1 });
    } else {
      swiperRef.current.slideNext();
    }
  }, [isMobileView, setUserData, userData]);

  const introduce = (
    <figure className="membership-request-welcome-wrapper__slide">
      <img src="/assets/images/membership-request-introduce.svg" alt="introduce" />
      <figcaption>Introduce</figcaption>
      <figcaption>Request to join the Common</figcaption>
    </figure>
  );

  const vote = (
    <figure className="membership-request-welcome-wrapper__slide">
      <img src="/assets/images/membership-request-vote.svg" alt="vote" />
      <figcaption>Vote</figcaption>
      <figcaption>Members vote on your request</figcaption>
    </figure>
  );

  const membership = (
    <figure className="membership-request-welcome-wrapper__slide">
      <img src="/assets/images/membership-request-membership.svg" alt="membership" />
      <figcaption>Membership</figcaption>
      <figcaption>Become a member with an equal vote</figcaption>
    </figure>
  );

  return (
    <div className="membership-request-content membership-request-welcome-wrapper">
      <div className="illustrations-container">
        {screenSize === ScreenSize.Desktop ? (
          <>
            {introduce}
            <img className="arrow" src="/icons/membership-request/arrow.svg" alt="arrow" />
            {vote}
            <img className="arrow" src="/icons/membership-request/arrow.svg" alt="arrow" />
            {membership}
          </>
        ) : (
          <Swiper
            pagination={{ clickable: true }}
            onSwiper={handleSwiper}
            onSlideChange={handleSlideChange}
          >
            <SwiperSlide>{introduce}</SwiperSlide>
            <SwiperSlide>{vote}</SwiperSlide>
            <SwiperSlide>{membership}</SwiperSlide>
          </Swiper>
        )}
      </div>
      <ModalFooter sticky>
        <div className="membership-request-welcome__modal-footer">
          <Button
            className="membership-request-welcome__submit-button"
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
          >
            {continueButtonText}
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
}
