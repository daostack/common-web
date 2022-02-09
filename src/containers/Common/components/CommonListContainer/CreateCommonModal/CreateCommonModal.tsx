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
import { ScreenSize } from "@/shared/constants";
import { CommonContributionType } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../interfaces";
import { CreationSteps } from "./CreationSteps";
import { Introduction } from "./Introduction";
import { Payment } from "./Payment";
import { CreateCommonStage } from "./constants";
import "./index.scss";

const INITIAL_DATA: IntermediateCreateCommonPayload = {
  name: "",
  image: null,
  contributionAmount: 0,
  contributionType: CommonContributionType.OneTime,
  agreementAccepted: false,
};

interface CreateCommonModalProps {
  isShowing: boolean;
  onClose: () => void;
}

export default function CreateCommonModal(props: CreateCommonModalProps) {
  const [{ stage, shouldStartFromLastStep }, setStageState] = useState({
    stage: CreateCommonStage.Introduction,
    shouldStartFromLastStep: false,
  });
  const [
    creationData,
    setCreationData,
  ] = useState<IntermediateCreateCommonPayload>(INITIAL_DATA);
  const [title, setTitle] = useState<ReactNode>("");
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<
    (() => boolean | undefined) | undefined
  >();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isHeaderSticky = [
    CreateCommonStage.CreationSteps,
    CreateCommonStage.Payment,
  ].includes(stage);
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
  const handleCreationStepsFinish = useCallback(() => {
    console.log("handleCreationStepsFinish");
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
      case CreateCommonStage.Payment:
        return (
          <Payment
            isHeaderScrolledToTop={isHeaderScrolledToTop}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleCreationStepsFinish}
            creationData={creationData}
            setCreationData={setCreationData}
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
    handleCreationStepsFinish,
    creationData,
    shouldStartFromLastStep,
  ]);

  useEffect(() => {
    if (!props.isShowing) {
      setStageState({
        stage: CreateCommonStage.Introduction,
        shouldStartFromLastStep: false,
      });
      setCreationData(INITIAL_DATA);
    }
  }, [props.isShowing]);

  return (
    <Modal
      isShowing={props.isShowing}
      onGoBack={onGoBack && handleGoBack}
      onClose={props.onClose}
      className={classNames("create-common-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      title={renderedTitle}
      hideCloseButton={!shouldShowCloseButton}
      isHeaderSticky={isHeaderSticky}
      onHeaderScrolledToTop={setIsHeaderScrolledToTop}
      closePrompt
    >
      <div id="content">{content}</div>
    </Modal>
  );
}
