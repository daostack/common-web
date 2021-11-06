import React from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestWelcome(props: IStageProps) {
  const screenSize = useSelector(getScreenSize());
  const { userData, setUserData } = props;

  const introduce = (
    <figure>
      <img src="/assets/images/membership-request-introduce.svg" alt="introduce" />
      <figcaption>Introduce</figcaption>
      <figcaption>Request to join the Common</figcaption>
    </figure>
  );

  const vote = (
    <figure>
      <img src="/assets/images/membership-request-vote.svg" alt="vote" />
      <figcaption>Vote</figcaption>
      <figcaption>Members vote on your request</figcaption>
    </figure>
  );

  const membership = (
    <figure>
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
          <Swiper pagination={{ clickable: true }}>
            <SwiperSlide>{introduce}</SwiperSlide>
            <SwiperSlide>{vote}</SwiperSlide>
            <SwiperSlide>{membership}</SwiperSlide>
          </Swiper>
        )}
      </div>
      <button onClick={() => setUserData({ ...userData, stage: 1 })} className="button-blue">
        Request to join
      </button>
    </div>
  );
}
