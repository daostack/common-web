import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { ModalFooter } from "../../../../../shared/components/Modal";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestWelcome(props: IStageProps) {
  const screenSize = useSelector(getScreenSize());
  const { userData, setUserData } = props;
  const [continueButtonText, setContinueButtonText] = useState("Continue");

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

  const handleContinueClick = useCallback(() => {
    setUserData({ ...userData, stage: 1 });
  }, [setUserData, userData]);

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
          <Swiper pagination={{ clickable: true }}>
            <SwiperSlide>{introduce}</SwiperSlide>
            <SwiperSlide>{vote}</SwiperSlide>
            <SwiperSlide>{membership}</SwiperSlide>
          </Swiper>
        )}
      </div>
      <ModalFooter sticky>
        <div className="membership-request-welcome__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            {continueButtonText}
          </button>
        </div>
      </ModalFooter>
    </div>
  );
}
