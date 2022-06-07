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
import { commonMembersSubCollection } from "@/containers/Common/store/api";
import { Modal } from "@/shared/components";
import { useZoomDisabling } from "@/shared/hooks";
import { ModalProps, ModalRef } from "@/shared/interfaces";
import { Common, CommonLink, Governance } from "@/shared/models";
import MembershipRequestCreated from "./MembershipRequestCreated";
import MembershipRequestCreating from "./MembershipRequestCreating";
import MembershipRequestIntroduce from "./MembershipRequestIntroduce";
import MembershipRequestProgressBar from "./MembershipRequestProgressBar";
import MembershipRequestRules from "./MembershipRequestRules";
import MembershipRequestWelcome from "./MembershipRequestWelcome";
import { selectUser } from "../../../../Auth/store/selectors";
import { selectCommonList } from "../../../store/selectors";
import { getCommonsList } from "../../../store/actions";
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

const initData: IMembershipRequestData = {
  stage: MembershipRequestStage.Welcome,
  intro: "",
};

interface IProps extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
  governance: Governance;
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
  const {
    isShowing,
    onClose,
    common,
    governance,
    onCreationStageReach,
  } = props;
  const shouldDisplayProgressBar =
    stage > MembershipRequestStage.Welcome &&
    stage < MembershipRequestStage.Creating;
  const shouldDisplayGoBack =
    (stage > MembershipRequestStage.Introduce &&
      stage < MembershipRequestStage.Creating) ||
    (stage === MembershipRequestStage.Introduce && !isMember);
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

    const isMember = commons.some(
      async (common) =>
        (await commonMembersSubCollection(common.id).doc(user?.uid).get())
          .exists
    );

    setIsMember(isMember);

    const payload: IMembershipRequestData = {
      ...initData,
      stage: isMember
        ? MembershipRequestStage.Introduce
        : MembershipRequestStage.Welcome,
    };

    setUserData(payload);
    onCreationStageReach(false);
  }, [
    isShowing,
    user,
    onCreationStageReach,
    disableZoom,
    resetZoom,
    commons,
    dispatch,
  ]);

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
