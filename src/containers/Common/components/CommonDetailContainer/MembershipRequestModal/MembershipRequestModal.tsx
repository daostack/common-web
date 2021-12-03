import React, { useCallback, useMemo, useState, ReactNode } from "react";
import { Modal } from "../../../../../shared/components";
import { ModalProps } from "../../../../../shared/interfaces";
import { Common } from "../../../../../shared/models";
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
  common?: Common;
}
export interface IProposalPayload {
  description: string;
  funding: number;
  commonId: string;
  cardId: string;
}

export interface IMembershipRequestData {
  stage: number;
  intro: string;
  notes: string;
  contribution_amount: number | undefined;
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
  cardId?: string;
}

const initData: IMembershipRequestData = {
  stage: 0,
  intro: "",
  notes: "",
  contribution_amount: undefined,
  contribution_id: undefined,
  fullname: "",
  city: "",
  country: "",
  district: "",
  address: "",
  postal: "",
  card_number: undefined,
  cvv: undefined,
  expiration_date: "",
};

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

export function MembershipRequestModal(props: IProps) {
  // TODO: should be saved in the localstorage for saving the progress?
  const [userData, setUserData] = useState(initData);
  const { stage } = userData;
  const { isShowing, onClose, common } = props;
  const shouldDisplayBackButton = stage > 0 && stage < 6;

  const renderCurrentStage = (stage: number) => {
    switch (stage) {
      case 0:
        return (
          <MembershipRequestWelcome
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 1:
        return (
          <MembershipRequestIntroduce
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 2:
        return (
          <MembershipRequestRules
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 3:
        return (
          <MembershipRequestContribution
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 4:
        return (
          <MembershipRequestBilling
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 5:
        return (
          <MembershipRequestPayment
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 6:
        return (
          <MembershipRequestCreating
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 7:
        return <MembershipRequestCreated closeModal={onClose} />;
    }
  };

  const renderedTitle = useMemo((): ReactNode => {
    if (stage >= 6) {
      return null;
    }

    const shouldBeBigTitle = stage === 0;
    const text = shouldBeBigTitle ? "Membership Request Process" : "Membership Request";
    const className = shouldBeBigTitle ? "membership-request-modal__title--big" : "membership-request-modal__title";

    return <h3 className={className}>{text}</h3>;
  }, [stage]);

  const moveStageBack = useCallback(() => {
    setUserData((data) => ({
      ...data,
      stage: data.stage - 1,
    }));
  }, []);

  return (
    <Modal
      isShowing={isShowing}
      onClose={onClose}
      className="mobile-full-screen membership-request-modal"
      mobileFullScreen
      title={renderedTitle}
      onGoBack={shouldDisplayBackButton ? moveStageBack : undefined}
    >
      <div className="membership-request-wrapper">
        {stage > 0 && stage !== 6 && stage !== 7 && (
          <MembershipRequestProgressBar currentStage={stage} />
        )}
        {renderCurrentStage(stage)}
      </div>
    </Modal>
  );
}
