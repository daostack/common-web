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
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Modal } from "../../../../../shared/components";
import { useZoomDisabling } from "../../../../../shared/hooks";
import { ModalProps, ModalRef } from "../../../../../shared/interfaces";
import { Common, CommonLink } from "../../../../../shared/models";
//import MembershipRequestContribution from "./MembershipRequestContribution";
import MembershipRequestCreated from "./MembershipRequestCreated";
import MembershipRequestCreating from "./MembershipRequestCreating";
import MembershipRequestIntroduce from "./MembershipRequestIntroduce";
import MembershipRequestPayment from "./MembershipRequestPayment";
import MembershipRequestProgressBar from "./MembershipRequestProgressBar";
import MembershipRequestRules from "./MembershipRequestRules";
import MembershipRequestWelcome from "./MembershipRequestWelcome";
import { selectUser } from "../../../../Auth/store/selectors";
import { selectCommonList } from "../../../store/selectors";
import { getCommonsList } from "../../../store/actions";
import "./index.scss";

export interface IStageProps {
  setUserData: Dispatch<SetStateAction<IMembershipRequestData>>;
  userData: IMembershipRequestData;
  common?: Common;
}

export interface IMembershipRequestData {
  stage: number;
  intro: string;
  links?: CommonLink[];
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
  const dispatch = useDispatch();
  // TODO: should be saved in the localstorage for saving the progress?
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const modalRef = useRef<ModalRef>(null);
  const [userData, setUserData] = useState(initData);
  const user = useSelector(selectUser());
  const [isMember, setIsMember] = useState<boolean>();
  const { stage } = userData;
  const { isShowing, onClose, common, onCreationStageReach } = props;
  const shouldDisplayProgressBar = stage > 0 && stage < 5;
  const shouldDisplayGoBack = (stage > 1 && stage < 5) || (stage === 1 && !isMember);
  const commons = useSelector(selectCommonList());

  /**
   * The data is saved only when we are on the Common Details Page.
   * Until implementing a robust way to handle the saving of the data the user will be notified of losing the data.
   */
  useEffect(() => {
    if (isShowing) {
      disableZoom();
    } else {
      resetZoom();
    }

    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }

    // TODO: export to a function to get common members
    const isMember = commons.some(async (common) => {
      if (common.members) {
        return (await common.members.doc(user?.uid).get()).exists;
      }
      return false;
    })

    setIsMember(isMember);

    const payload: IMembershipRequestData = {
      ...initData,
      cardId: uuidv4(),
      stage: isMember ? 1 : 0,
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
  }, [isShowing, user, onCreationStageReach, disableZoom, resetZoom, commons, dispatch]);

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
            common={common}
          />
        );
      case 3:
        return (
          <MembershipRequestPayment
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 4:
        return (
          <MembershipRequestCreating
            userData={userData}
            setUserData={setUserData}
            common={common}
          />
        );
      case 5:
        return <MembershipRequestCreated closeModal={onClose} />;
    }
  };

  const renderedTitle = useMemo((): ReactNode => {
    if (stage >= 5 || stage === 0) {
      return null;
    }
    return <h3 className="membership-request-modal__title">Membership Request</h3>;
  }, [stage]);

  const moveStageBack = useCallback(() => {
    setUserData((data) => {
      const isContributionStage = data.stage === 3;
      const prevStage =
        isContributionStage && common.rules.length === 0
          ? data.stage - 2
          : data.stage - 1;

      return {
        ...data,
        stage: prevStage,
      };
    });
  }, [common]);

  useEffect(() => {
    if (stage === 4) {
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
      closePrompt={stage !== 5}
      title={renderedTitle}
      onGoBack={shouldDisplayGoBack ? moveStageBack : undefined}
      styles={{
        content: stage === 0 ? "membership-request-modal__content--introduction" : ""
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
