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
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../../../../shared/components";
import { useZoomDisabling } from "../../../../../shared/hooks";
import { ModalProps, ModalRef } from "../../../../../shared/interfaces";
import { Common } from "../../../../../shared/models";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { ScreenSize } from "../../../../../shared/constants";
import "./index.scss";
import MembershipRequestContribution from "./MembershipRequestContribution";
import MembershipRequestCreated from "./MembershipRequestCreated";
import MembershipRequestCreating from "./MembershipRequestCreating";
import MembershipRequestIntroduce from "./MembershipRequestIntroduce";
import MembershipRequestPayment from "./MembershipRequestPayment";
import MembershipRequestProgressBar from "./MembershipRequestProgressBar";
import MembershipRequestRules from "./MembershipRequestRules";
import MembershipRequestWelcome from "./MembershipRequestWelcome";
import { selectUser } from "../../../../Auth/store/selectors";

export interface IStageProps {
  setUserData: Dispatch<SetStateAction<IMembershipRequestData>>;
  userData: IMembershipRequestData;
  common?: Common;
}

export interface IMembershipRequestData {
  stage: number;
  intro: string;
  notes: string;
  contributionAmount: number | undefined;
  fullname: string;
  city: string;
  country: string;
  district: string;
  address: string;
  postal: string;
  card_number: number | undefined;
  cvv: number | undefined;
  expiration_date: string;
  cardId: string;
}

const initData: IMembershipRequestData = {
  stage: 0,
  intro: "",
  notes: "",
  contributionAmount: undefined,
  fullname: "",
  city: "",
  country: "",
  district: "",
  address: "",
  postal: "",
  card_number: undefined,
  cvv: undefined,
  expiration_date: "",
  cardId: uuidv4(),
};

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
  onCreationStageReach: (reached: boolean) => void;
}

export function MembershipRequestModal(props: IProps) {
  // TODO: should be saved in the localstorage for saving the progress?
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const modalRef = useRef<ModalRef>(null);
  const [userData, setUserData] = useState(initData);
  const user = useSelector(selectUser());
  const { stage } = userData;
  const { isShowing, onClose, common, onCreationStageReach } = props;
  const shouldDisplayProgressBar = stage > 0 && stage < 5;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  /**
   * The data is saved only when we are on the Common Details Page.
   * Until implementing a robust way to handle the saving of the data the user will be notified of losing the data.
   */
  useEffect(() => {
    if (isShowing) {
      disableZoom();
      return;
    }

    const payload: IMembershipRequestData = {
      ...initData,
      cardId: uuidv4(),
    };

    if (user) {
      payload.fullname = user.displayName ?? "";
      if (!payload.fullname) {
        payload.fullname = `${user.firstName} ${user.lastName}`;
      }
      payload.country = user.country ?? "";
    }

    setUserData(payload);
    onCreationStageReach(false);
    resetZoom();
  }, [isShowing, user, onCreationStageReach, disableZoom, resetZoom]);

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
            common={common}
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
          <MembershipRequestPayment
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 5:
        return (
          <MembershipRequestCreating
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 6:
        return <MembershipRequestCreated closeModal={onClose} />;
    }
  };

  const renderedTitle = useMemo((): ReactNode => {
    if (stage >= 5) {
      return null;
    }

    const shouldBeBigTitle = stage === 0;
    const text = shouldBeBigTitle
      ? "Membership Request Process"
      : "Membership Request";
    const className = classNames("membership-request-modal__title", {
      "membership-request-modal__title--big": shouldBeBigTitle && !isMobileView,
      "membership-request-modal__title--short":
        shouldBeBigTitle && isMobileView,
    });

    return <h3 className={className}>{text}</h3>;
  }, [stage, isMobileView]);

  const moveStageBack = useCallback(() => {
    setUserData((data) => ({
      ...data,
      stage: data.stage - 1,
    }));
  }, []);

  useEffect(() => {
    if (stage === 5) {
      onCreationStageReach(true);
    }
  }, [stage, onCreationStageReach]);

  useEffect(() => {
    modalRef.current?.scrollToTop();
  }, [stage]);

  return (
    <Modal
      ref={modalRef}
      isShowing={isShowing}
      onClose={onClose}
      className="mobile-full-screen membership-request-modal"
      mobileFullScreen
      closePrompt={stage !== 6}
      title={renderedTitle}
      onGoBack={shouldDisplayProgressBar ? moveStageBack : undefined}
      styles={{
        header:
          stage === 0
            ? "membership-request-modal__header-wrapper--introduction"
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
