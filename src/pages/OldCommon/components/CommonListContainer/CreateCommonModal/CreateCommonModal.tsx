import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { CommonEvent, CommonEventEmitter } from "@/events";
import { Modal } from "@/shared/components";
import { GovernanceActions, ScreenSize } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { Common, Governance } from "@/shared/models";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { getScreenSize } from "@/shared/store/selectors";
import { ProjectsStateItem } from "@/store/states";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../interfaces";
import { Confirmation } from "./Confirmation";
import { CreationSteps } from "./CreationSteps";
import { Error } from "./Error";
import { Payment } from "./Payment";
import { Success } from "./Success";
import { CreateCommonStage } from "./constants";
import "./index.scss";

const INITIAL_DATA: IntermediateCreateCommonPayload = {
  name: "",
  image: null,
  agreementAccepted: false,
};

interface CreateCommonModalProps {
  isShowing: boolean;
  onClose: () => void;
  governance?: Governance;
  parentCommonId?: string;
  isSubCommonCreation: boolean;
  subCommons?: Common[];
  onCommonCreate?: (data: { common: Common; governance: Governance }) => void;
  onGoToCommon?: (common: Common) => void;
}

const emptyFunction = () => {
  return;
};

export default function CreateCommonModal(props: CreateCommonModalProps) {
  const {
    governance,
    subCommons = [],
    parentCommonId,
    onCommonCreate,
    isSubCommonCreation,
    onGoToCommon,
  } = props;
  const dispatch = useDispatch();
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const initialStage = CreateCommonStage.CreationSteps;
  const [{ stage, shouldStartFromLastStep }, setStageState] = useState({
    stage: initialStage,
    shouldStartFromLastStep: false,
  });
  const [creationData, setCreationData] =
    useState<IntermediateCreateCommonPayload>(INITIAL_DATA);
  const [paymentData, setPaymentData] = useState<PaymentPayload>({});
  const [title, setTitle] = useState<ReactNode>("");
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<
    (() => boolean | undefined) | undefined
  >();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const [createdCommonData, setCreatedCommonData] = useState<{
    common: Common;
    governance: Governance;
  } | null>(null);
  const [errorText, setErrorText] = useState("");
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isHeaderSticky = stage === CreateCommonStage.CreationSteps;

  const setBigTitle = useCallback((title: string) => {
    setTitle(title);
    setIsBigTitle(true);
  }, []);
  const setSmallTitle = useCallback((title: ReactNode) => {
    setTitle(title);
    setIsBigTitle(false);
  }, []);

  const setGoBackHandler = useCallback(
    (handler?: (() => boolean | undefined) | null) => {
      setOnGoBack(() => handler ?? undefined);
    },
    [],
  );
  const moveStageBack = useCallback(() => {
    setStageState(({ stage }) => ({
      stage: stage === CreateCommonStage.CreationSteps ? stage : stage - 1,
      shouldStartFromLastStep: true,
    }));
  }, []);
  const moveStageForward = useCallback(() => {
    setStageState(({ stage }) => ({
      stage: stage + 1,
      shouldStartFromLastStep: false,
    }));
  }, []);
  const handleGoBack = useCallback(() => {
    if (onGoBack && onGoBack()) {
      moveStageBack();
    }
  }, [onGoBack, moveStageBack]);
  const handleError = useCallback((errorText: string) => {
    setErrorText(errorText);
    setStageState((state) => ({
      ...state,
      stage: CreateCommonStage.Error,
    }));
  }, []);
  const handleCommonCreation = useCallback(
    (
      data: { common: Common; governance: Governance } | null,
      errorText: string,
    ) => {
      if (errorText || !data) {
        handleError(errorText);
        return;
      }

      if (onCommonCreate) {
        onCommonCreate(data);
      }

      setCreatedCommonData(data);
      setStageState((state) => ({
        ...state,
        stage: isSubCommonCreation
          ? CreateCommonStage.Success
          : CreateCommonStage.Payment,
      }));
    },
    [handleError, onCommonCreate],
  );
  const handlePaymentFinish = useCallback(() => {
    setStageState((state) => ({
      ...state,
      stage: CreateCommonStage.Success,
    }));
  }, []);
  const renderedTitle = useMemo((): ReactNode => {
    if (!title) {
      return null;
    }
    if (!isBigTitle) {
      return title;
    }

    return <h3 className="create-common-modal__title">{title}</h3>;
  }, [title, isBigTitle]);
  const content = useMemo(() => {
    switch (stage) {
      case CreateCommonStage.CreationSteps:
        return (
          <CreationSteps
            isHeaderScrolledToTop={isHeaderScrolledToTop}
            isSubCommonCreation={isSubCommonCreation}
            governance={governance}
            subCommons={subCommons}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={moveStageForward}
            creationData={creationData}
            setCreationData={setCreationData}
            shouldStartFromLastStep={shouldStartFromLastStep}
          />
        );
      case CreateCommonStage.Confirmation:
        return (
          <Confirmation
            isSubCommonCreation={isSubCommonCreation}
            parentCommonId={parentCommonId}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleCommonCreation}
            creationData={creationData}
          />
        );
      case CreateCommonStage.Payment:
        return createdCommonData ? (
          <Payment
            isHeaderScrolledToTop={isHeaderScrolledToTop}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handlePaymentFinish}
            onError={handleError}
            common={createdCommonData.common}
            paymentData={paymentData}
            setPaymentData={setPaymentData}
            memberAdmittanceOptions={
              creationData.memberAdmittanceOptions as MemberAdmittanceLimitations
            }
          />
        ) : null;
      case CreateCommonStage.Success:
        return createdCommonData ? (
          <Success
            common={createdCommonData.common}
            isSubCommonCreation={isSubCommonCreation}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onGoToCommon={onGoToCommon}
          />
        ) : null;
      case CreateCommonStage.Error:
        return (
          <Error
            errorText={errorText}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={props.onClose}
          />
        );
      default:
        return null;
    }
  }, [
    stage,
    isSubCommonCreation,
    governance,
    isMobileView,
    isHeaderScrolledToTop,
    setSmallTitle,
    setBigTitle,
    setGoBackHandler,
    moveStageForward,
    creationData,
    createdCommonData,
    shouldStartFromLastStep,
    props.onClose,
    errorText,
    handleCommonCreation,
    parentCommonId,
    paymentData,
    handlePaymentFinish,
    onGoToCommon,
  ]);

  useEffect(() => {
    if (props.isShowing) {
      disableZoom();
      return;
    }

    setStageState({
      stage: initialStage,
      shouldStartFromLastStep: false,
    });
    setCreationData(INITIAL_DATA);
    resetZoom();
  }, [props.isShowing, initialStage, disableZoom, resetZoom]);

  useEffect(() => {
    if (stage !== CreateCommonStage.Success || !createdCommonData) {
      return;
    }

    const hasPermissionToAddProject = Object.values(
      createdCommonData.governance.circles,
    ).some((circle) => circle.allowedActions[GovernanceActions.CREATE_PROJECT]);
    const projectsStateItem: ProjectsStateItem = {
      commonId: createdCommonData.common.id,
      image: createdCommonData.common.image,
      name: createdCommonData.common.name,
      directParent: createdCommonData.common.directParent,
      hasMembership: true,
      hasPermissionToAddProject,
      notificationsAmount: 0,
    };

    CommonEventEmitter.emit(CommonEvent.ProjectCreated, projectsStateItem);
    CommonEventEmitter.emit(
      CommonEvent.CommonCreated,
      createdCommonData.common,
    );
  }, [stage]);

  return (
    <Modal
      isShowing={props.isShowing}
      onGoBack={onGoBack && handleGoBack}
      onClose={shouldShowCloseButton ? props.onClose : emptyFunction}
      className={classNames("create-common-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      title={renderedTitle}
      hideCloseButton={!shouldShowCloseButton}
      isHeaderSticky={isHeaderSticky}
      onHeaderScrolledToTop={setIsHeaderScrolledToTop}
      closePrompt={
        shouldShowCloseButton &&
        ![CreateCommonStage.Success, CreateCommonStage.Error].includes(stage)
      }
      fullHeight
    >
      <div id="content">{content}</div>
    </Modal>
  );
}
