import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../../../shared/components";
import { ScreenSize } from "../../../../../shared/constants";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestIntroduce(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const handleContinue = () => {
    const nextStage = common && common.rules.length > 0 ? 2 : 3;

    setUserData((nextUserData) => ({ ...nextUserData, stage: nextStage }));
  };

  return (
    <div className="membership-request-content membership-request-introduce">
      <div className="sub-title">Introduce Yourself</div>
      <div className="sub-text">
        Let the Common members learn more about you and how you relate to the
        cause.
      </div>
      <label>Intro</label>
      <textarea
        value={userData.intro}
        onChange={(e) => setUserData({ ...userData, intro: e.target.value })}
        placeholder="Let the Common members learn more about you and how you relate to the cause."
      />
      <label>Notes</label>
      <textarea
        value={userData.notes}
        onChange={(e) => setUserData({ ...userData, notes: e.target.value })}
        placeholder="Why do you want to join this Common?"
      />
      <Button
        className="membership-request-introduce__submit-button"
        onClick={handleContinue}
        disabled={!userData.intro || !userData.notes}
        shouldUseFullWidth={isMobileView}
      >
        Continue
      </Button>
    </div>
  );
}
