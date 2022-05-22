import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Modal } from "@/shared/components";
import { getScreenSize } from "@/shared/store/selectors";
import { useZoomDisabling } from "@/shared/hooks";
import { ScreenSize } from "@/shared/constants";
import { Common } from "@/shared/models";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../interfaces";
import { Confirmation } from "./Confirmation";
import { CreationSteps } from "./CreationSteps";
import { Error } from "./Error";
import { Introduction } from "./Introduction";
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
}

const emptyFunction = () => {
  return;
};

export default function CreateCommonModal(props: CreateCommonModalProps) {
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const [{ stage, shouldStartFromLastStep }, setStageState] = useState({
    stage: CreateCommonStage.Introduction,
    shouldStartFromLastStep: false,
  });
  const [
    creationData,
    setCreationData,
  ] = useState<IntermediateCreateCommonPayload>(INITIAL_DATA);
  const [paymentData, setPaymentData] = useState<PaymentPayload>({});
  const [title, setTitle] = useState<ReactNode>("");
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<
    (() => boolean | undefined) | undefined
  >();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const [createdCommon, setCreatedCommon] = useState<Common | null>(null);
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
    []
  );
  const moveStageBack = useCallback(() => {
    setStageState(({ stage }) => ({
      stage: stage === CreateCommonStage.Introduction ? stage : stage - 1,
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
    (common: Common | null, errorText: string) => {
      if (errorText || !common) {
        handleError(errorText);
        return;
      }

      setCreatedCommon(common);
      setStageState((state) => ({
        ...state,
        stage: CreateCommonStage.Success,
      }));
    },
    [handleError]
  );
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
      case CreateCommonStage.Introduction:
        return (
          <Introduction
            setTitle={isMobileView ? setSmallTitle : setBigTitle}
            setGoBackHandler={setGoBackHandler}
            onFinish={moveStageForward}
          />
        );
      case CreateCommonStage.CreationSteps:
        return (
          <CreationSteps
            isHeaderScrolledToTop={isHeaderScrolledToTop}
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
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleCommonCreation}
            creationData={creationData}
          />
        );
      case CreateCommonStage.Success:
        return createdCommon ? (
          <Success
            common={createdCommon}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
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
    isMobileView,
    isHeaderScrolledToTop,
    setSmallTitle,
    setBigTitle,
    setGoBackHandler,
    moveStageForward,
    handleError,
    creationData,
    createdCommon,
    shouldStartFromLastStep,
    paymentData,
    props.onClose,
    errorText,
    handleCommonCreation,
  ]);

  useEffect(() => {
    if (props.isShowing) {
      disableZoom();
      return;
    }

    setStageState({
      stage: CreateCommonStage.Introduction,
      shouldStartFromLastStep: false,
    });
    setCreationData(INITIAL_DATA);
    resetZoom();
  }, [props.isShowing, disableZoom, resetZoom]);

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
    >
      <div id="content">{content}</div>
    </Modal>
  );
}
