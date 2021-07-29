import React from "react";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

export default function MembershipRequestIntroduce(props: IStageProps) {
  const { userData, setUserData } = props;

  return (
    <div className="membership-request-content membership-request-introduce">
      <div className="sub-title">Introduce Yourself</div>
      <div className="sub-text">Let the Common members learn more about you and how you relate to the cause.</div>
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
      <button
        onClick={() => setUserData({ ...userData, stage: 2 })}
        className="button-blue"
        disabled={!userData.intro || !userData.notes}
      >
        Continue
      </button>
    </div>
  );
}
