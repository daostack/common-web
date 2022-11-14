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
import { ScreenSize } from "@/shared/constants";
import { useZoomDisabling } from "@/shared/hooks";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { emptyFunction } from "@/shared/utils";
import { UpdateCommonData } from "../../../interfaces";
import { Confirmation } from "./Confirmation";
import { EditSteps } from "./EditSteps";
import { Error } from "./Error";
import { Success } from "./Success";
import { UpdateCommonStage } from "./constants";
import "./index.scss";

interface EditCommonModalProps {
  isShowing: boolean;
  onClose: () => void;
  governance?: Governance;
  parentCommonId?: string;
  isSubCommonCreation: boolean;
  common: Common;
  shouldBeWithoutIntroduction?: boolean;
}

export default function EditCommonModal(props: EditCommonModalProps) {
  const { governance, parentCommonId, common, isSubCommonCreation } = props;
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const initialStage = UpdateCommonStage.EditSteps;
  const [{ stage, shouldStartFromLastStep }, setStageState] = useState({
    stage: initialStage,
    shouldStartFromLastStep: false,
  });
  const INITIAL_DATA: UpdateCommonData = {
    name: common.name,
    image: common.image,
    byline: common.byline,
    description: common.description,
    links: common.links,
  };
  const [currentData, setCurrentData] =
    useState<UpdateCommonData>(INITIAL_DATA);
  const [title, setTitle] = useState<ReactNode>("");
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<
    (() => boolean | undefined) | undefined
  >();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const [updatedCommon, setUpdatedCommon] = useState<Common | null>(null);
  const [errorText, setErrorText] = useState("");
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isHeaderSticky = stage === UpdateCommonStage.EditSteps;

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
      stage: stage - 1,
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
      stage: UpdateCommonStage.Error,
    }));
  }, []);
  const handleCommonUpdate = useCallback(
    (common: Common | null, errorText: string) => {
      if (errorText || !common) {
        handleError(errorText);
        return;
      }

      setUpdatedCommon(common);
      setStageState((state) => ({
        ...state,
        stage: UpdateCommonStage.Success,
      }));
    },
    [handleError],
  );
  const renderedTitle = useMemo((): ReactNode => {
    if (!title) {
      return null;
    }
    if (!isBigTitle) {
      return title;
    }

    return <h3 className="edit-common-modal__title">{title}</h3>;
  }, [title, isBigTitle]);
  const content = useMemo(() => {
    switch (stage) {
      case UpdateCommonStage.EditSteps:
        return (
          <EditSteps
            isSubCommonCreation={isSubCommonCreation}
            isHeaderScrolledToTop={isHeaderScrolledToTop}
            governance={governance}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={moveStageForward}
            currentData={currentData}
            setCurrentData={setCurrentData}
            shouldStartFromLastStep={shouldStartFromLastStep}
          />
        );
      case UpdateCommonStage.Confirmation:
        return (
          <Confirmation
            isSubCommonCreation={isSubCommonCreation}
            parentCommonId={parentCommonId}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleCommonUpdate}
            currentData={currentData}
            commonId={common.id}
          />
        );
      case UpdateCommonStage.Success:
        return updatedCommon ? (
          <Success
            isSubCommonCreation={isSubCommonCreation}
            common={updatedCommon}
            onFinish={props.onClose}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
          />
        ) : null;
      case UpdateCommonStage.Error:
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
    governance,
    isMobileView,
    isHeaderScrolledToTop,
    setSmallTitle,
    setBigTitle,
    setGoBackHandler,
    moveStageForward,
    currentData,
    updatedCommon,
    shouldStartFromLastStep,
    props.onClose,
    errorText,
    handleCommonUpdate,
    parentCommonId,
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
    setCurrentData(INITIAL_DATA);
    resetZoom();
  }, [props.isShowing, initialStage, disableZoom, resetZoom]);

  return (
    <Modal
      isShowing={props.isShowing}
      onGoBack={onGoBack && handleGoBack}
      onClose={shouldShowCloseButton ? props.onClose : emptyFunction}
      className={classNames("edit-common-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      title={renderedTitle}
      hideCloseButton={!shouldShowCloseButton}
      isHeaderSticky={isHeaderSticky}
      onHeaderScrolledToTop={setIsHeaderScrolledToTop}
      closePrompt={
        shouldShowCloseButton &&
        ![UpdateCommonStage.Success, UpdateCommonStage.Error].includes(stage)
      }
      fullHeight
    >
      <div id="content">{content}</div>
    </Modal>
  );
}
