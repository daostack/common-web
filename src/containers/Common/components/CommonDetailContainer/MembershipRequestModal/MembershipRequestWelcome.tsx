import React from "react";
import { useSelector } from "react-redux";
import { Button } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { ModalFooter } from "@/shared/components/Modal";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

export default function MembershipRequestWelcome(props: IStageProps) {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const { userData, setUserData } = props;

  return (
    <div className="membership-request-content membership-request-welcome-wrapper">
      <span className="membership-request-welcome-wrapper__title">How to join a common</span>
      <div className="illustrations-container">
        <figure>
          <img src="/assets/images/membership-request-introduce.svg" alt="introduce" />
          <figcaption>Introduce yourself and add your personal contribution.</figcaption>
        </figure>

        <figure>
          <img src="/assets/images/membership-request-vote.svg" alt="vote" />
          <figcaption>Community members vote to approve your request to join.</figcaption>
        </figure>

        <figure>
          <img src="/assets/images/membership-request-membership.svg" alt="membership" />
          <figcaption>Become a equal member with an equal vote.</figcaption>
        </figure>
      </div>

      <ModalFooter sticky>
        <div className="membership-request-welcome__modal-footer">
          <Button
            className="membership-request-welcome__submit-button"
            onClick={() => setUserData({
              ...userData,
              stage: MembershipRequestStage.Introduce,
            })}
            shouldUseFullWidth={isMobileView}>
            Got it
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
}
