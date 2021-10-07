import React, { useState } from "react";
import "./index.scss";
import MembershipRequestBilling from "./MembershipRequestBilling";
import MembershipRequestContribution from "./MembershipRequestContribution";
import MembershipRequestCreated from "./MembershipRequestCreated";
import MembershipRequestCreating from "./MembershipRequestCreating";
import MembershipRequestIntroduce from "./MembershipRequestIntroduce";
import MembershipRequestPayment from "./MembershipRequestPayment";
import MembershipRequestProgressBar from "./MembershipRequestProgressBar";
import MembershipRequestRules from "./MembershipRequestRules";
import MembershipRequestWelcome from "./MembershipRequestWelcome";

export interface IStageProps {
  setUserData: Function;
  userData: IMembershipRequestData;
}

export interface IMembershipRequestData {
  stage: number;
  intro: string;
  notes: string;
  contribution_amount: number;
  contribution_id: number | undefined;
  fullname: string;
  city: string;
  country: string;
  district: string;
  address: string;
  postal: string;
  card_number: number | undefined;
  cvv: number | undefined;
  expiration_date: string;
}

const initData: IMembershipRequestData = {
  stage: 5,
  intro: "I'm a web developer",
  notes: "Hello :)",
  contribution_amount: 800,
  contribution_id: 1,
  fullname: "Roie Natan",
  city: "Safed",
  country: "IL",
  district: "HaZafon",
  address: "Jabotinsky",
  postal: "12345",
  card_number: undefined,
  cvv: undefined,
  expiration_date: "",
};

interface IProps {
  closeModal: Function;
}

export default function MembershipRequestModal(props: IProps) {
  // TODO: should be saved in the localstorage for saving the progress?
  const [userData, setUserData] = useState(initData);
  const { stage } = userData;

  const renderCurrentStage = (stage: number) => {
    switch (stage) {
      case 0:
        return <MembershipRequestWelcome userData={userData} setUserData={setUserData} />;
      case 1:
        return <MembershipRequestIntroduce userData={userData} setUserData={setUserData} />;
      case 2:
        return <MembershipRequestRules userData={userData} setUserData={setUserData} />;
      case 3:
        return <MembershipRequestContribution userData={userData} setUserData={setUserData} />;
      case 4:
        return <MembershipRequestBilling userData={userData} setUserData={setUserData} />;
      case 5:
        return <MembershipRequestPayment userData={userData} setUserData={setUserData} />;
      case 6:
        return <MembershipRequestCreating userData={userData} setUserData={setUserData} />;
      case 7:
        return <MembershipRequestCreated closeModal={props.closeModal} />;
    }
  };

  return (
    <div className="membership-request-wrapper">
      {stage !== 6 && stage !== 7 && (
        <div className="top">
          {stage > 0 && (
            <img
              src="/icons/left-arrow.svg"
              alt="back"
              className="arrow-back"
              onClick={() => setUserData({ ...userData, stage: stage - 1 })}
            />
          )}
          <div className="title">Membership Request</div>
        </div>
      )}
      {stage > 0 && stage !== 6 && stage !== 7 && <MembershipRequestProgressBar currentStage={stage} />}
      {renderCurrentStage(stage)}
    </div>
  );
}
