import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { GlobalLoader, Modal } from "@/shared/components";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps, ModalRef } from "@/shared/interfaces";
import { Common, CommonLink, Governance } from "@/shared/models";
import MembershipRequestContribution from "./MembershipRequestContribution";
import MembershipRequestCreated from "./MembershipRequestCreated";
import MembershipRequestCreating from "./MembershipRequestCreating";
import MembershipRequestIntroduce from "./MembershipRequestIntroduce";
import MembershipRequestPayment from "./MembershipRequestPayment";
import MembershipRequestProgressBar from "./MembershipRequestProgressBar";
import MembershipRequestRules from "./MembershipRequestRules";
import MembershipRequestWelcome from "./MembershipRequestWelcome";
import { useMemberInAnyCommon } from "../../../hooks";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

export interface IStageProps {
  setUserData: Dispatch<SetStateAction<IMembershipRequestData>>;
  userData: IMembershipRequestData;
  common?: Common;
  governance?: Governance;
}

export interface IMembershipRequestData {
  stage: MembershipRequestStage;
  intro: string;
  links?: CommonLink[];
}

const INIT_DATA: IMembershipRequestData = {
  stage: MembershipRequestStage.Welcome,
  intro: "",
};

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
  governance: Governance;
  onCreationStageReach: (reached: boolean) => void;
}

export function MembershipRequestModal(props: IProps) {
  // TODO: should be saved in the localstorage for saving the progress?
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const modalRef = useRef<ModalRef>(null);
  const [userData, setUserData] = useState(INIT_DATA);
  const { stage } = userData;
  const { isShowing, onClose, common, governance, onCreationStageReach } =
    props;
  const {
    loading: isMembershipCheckLoading,
    fetched: isMembershipCheckDone,
    data: isMember,
    checkMembershipInAnyCommon,
    resetMembershipCheck,
  } = useMemberInAnyCommon();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const shouldDisplayProgressBar =
    stage > MembershipRequestStage.Welcome &&
    stage < MembershipRequestStage.Creating;
  const shouldDisplayGoBack =
    (stage > MembershipRequestStage.Introduce &&
      stage < MembershipRequestStage.Creating) ||
    (stage === MembershipRequestStage.Introduce && !isMember);

  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }
  }, [isShowing, disableZoom, resetZoom]);

  useEffect(() => {
    if (isShowing && !isMembershipCheckLoading && !isMembershipCheckDone) {
      checkMembershipInAnyCommon();
    }
  }, [
    isShowing,
    isMembershipCheckLoading,
    isMembershipCheckDone,
    checkMembershipInAnyCommon,
  ]);

  useEffect(() => {
    resetMembershipCheck();
  }, [userId]);

  /**
   * The data is saved only when we are on the Common Details Page.
   * Until implementing a robust way to handle the saving of the data the user will be notified of losing the data.
   */
  useEffect(() => {
    if (!isMembershipCheckDone || !isShowing) {
      return;
    }

    const payload: IMembershipRequestData = {
      ...INIT_DATA,
      stage: isMember
        ? MembershipRequestStage.Introduce
        : MembershipRequestStage.Welcome,
    };

    setUserData(payload);
    onCreationStageReach(false);
  }, [isMembershipCheckDone, isMember, isShowing, onCreationStageReach]);

  const renderCurrentStage = (stage: number) => {
    switch (stage) {
      case MembershipRequestStage.Welcome:
        return (
          <MembershipRequestWelcome
            userData={userData}
            setUserData={setUserData}
          />
        );
      case MembershipRequestStage.Introduce:
        return (
          <MembershipRequestIntroduce
            userData={userData}
            setUserData={setUserData}
            common={common}
            governance={governance}
          />
        );
      case MembershipRequestStage.Rules:
        return (
          <MembershipRequestRules
            userData={userData}
            setUserData={setUserData}
            governance={governance}
          />
        );
      case MembershipRequestStage.Contribution:
        return (
          <MembershipRequestContribution
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case MembershipRequestStage.Payment:
        return (
          <MembershipRequestPayment
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case MembershipRequestStage.Creating:
        return (
          <MembershipRequestCreating
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case MembershipRequestStage.Created:
        return <MembershipRequestCreated closeModal={onClose} />;
    }
  };

  const renderedTitle = useMemo((): ReactNode => {
    if (
      stage >= MembershipRequestStage.Creating ||
      stage === MembershipRequestStage.Welcome
    ) {
      return null;
    }
    return (
      <h3 className="membership-request-modal__title">Membership Request</h3>
    );
  }, [stage]);

  const moveStageBack = useCallback(() => {
    setUserData((data) => {
      const prevStage = data.stage - 1;
      return {
        ...data,
        stage: prevStage,
      };
    });
  }, []);

  useEffect(() => {
    if (stage === MembershipRequestStage.Creating) {
      onCreationStageReach(true);
    }
  }, [stage, onCreationStageReach]);

  useEffect(() => {
    modalRef.current?.scrollToTop();
  }, [stage]);

  if (isShowing && !isMembershipCheckDone) {
    return <GlobalLoader />;
  }

  return (
    <Modal
      ref={modalRef}
      isShowing={isShowing}
      onClose={onClose}
      className="mobile-full-screen membership-request-modal"
      mobileFullScreen
      closePrompt={stage !== MembershipRequestStage.Created}
      title={renderedTitle}
      onGoBack={shouldDisplayGoBack ? moveStageBack : undefined}
      styles={{
        content:
          stage === MembershipRequestStage.Welcome
            ? "membership-request-modal__content--introduction"
            : "",
      }}
    >
      <div className="membership-request-wrapper">
        {shouldDisplayProgressBar && (
          <MembershipRequestProgressBar currentStage={stage} />
        )}
        {renderCurrentStage(stage)}
      </div>
    </Modal>
  );
}
