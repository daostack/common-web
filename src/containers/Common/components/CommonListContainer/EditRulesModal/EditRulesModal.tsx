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
import { UpdateGovernanceData } from "../../../interfaces";
import { Confirmation } from "./Confirmation";
import { EditSteps } from "./EditSteps";
import { Error } from "./Error";
import { Success } from "./Success";
import { UpdateGovernanceStage } from "./constants";
import "./index.scss";

interface EditRulesModalProps {
  isShowing: boolean;
  onClose: () => void;
  governance: Governance;
  parentCommonId?: string;
  common: Common;
  shouldBeWithoutIntroduction?: boolean;
}

export default function EditRulesModal(props: EditRulesModalProps) {
  const { governance, parentCommonId, common } = props;
  const { disableZoom, resetZoom } = useZoomDisabling({
    shouldDisableAutomatically: false,
  });
  const initialStage = UpdateGovernanceStage.EditSteps;
  const [{ stage, shouldStartFromLastStep }, setStageState] = useState({
    stage: initialStage,
    shouldStartFromLastStep: false,
  });
  const INITIAL_DATA: UpdateGovernanceData = {
    unstructuredRules: governance.unstructuredRules || [],
  };
  const [currentData, setCurrentData] =
    useState<UpdateGovernanceData>(INITIAL_DATA);
  const [title, setTitle] = useState<ReactNode>("");
  const [isBigTitle, setIsBigTitle] = useState(true);
  const [isHeaderScrolledToTop, setIsHeaderScrolledToTop] = useState(true);
  const [onGoBack, setOnGoBack] = useState<
    (() => boolean | undefined) | undefined
  >();
  const [shouldShowCloseButton, setShouldShowCloseButton] = useState(true);
  const [updatedGovernance, setUpdatedGovernance] = useState<Governance | null>(
    null,
  );
  const [errorText, setErrorText] = useState("");
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isHeaderSticky = stage === UpdateGovernanceStage.EditSteps;

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
      stage: UpdateGovernanceStage.Error,
    }));
  }, []);
  const handleGovernanceUpdate = useCallback(
    (governance: Governance | null, errorText: string) => {
      if (errorText || !governance) {
        handleError(errorText);
        return;
      }

      setUpdatedGovernance(governance);
      setStageState((state) => ({
        ...state,
        stage: UpdateGovernanceStage.Success,
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

    return <h3 className="edit-rules-modal__title">{title}</h3>;
  }, [title, isBigTitle]);
  const content = useMemo(() => {
    switch (stage) {
      case UpdateGovernanceStage.EditSteps:
        return (
          <EditSteps
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
      case UpdateGovernanceStage.Confirmation:
        return (
          <Confirmation
            parentCommonId={parentCommonId}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
            onFinish={handleGovernanceUpdate}
            currentData={currentData}
            commonId={common.id}
            governanceId={governance.id}
          />
        );
      case UpdateGovernanceStage.Success:
        return updatedGovernance ? (
          <Success
            governance={updatedGovernance}
            onFinish={props.onClose}
            setTitle={setSmallTitle}
            setGoBackHandler={setGoBackHandler}
            setShouldShowCloseButton={setShouldShowCloseButton}
          />
        ) : null;
      case UpdateGovernanceStage.Error:
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
    updatedGovernance,
    shouldStartFromLastStep,
    props.onClose,
    errorText,
    handleGovernanceUpdate,
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
      className={classNames("edit-rules-modal", {
        "mobile-full-screen": isMobileView,
      })}
      mobileFullScreen={isMobileView}
      title={renderedTitle}
      hideCloseButton={!shouldShowCloseButton}
      isHeaderSticky={isHeaderSticky}
      onHeaderScrolledToTop={setIsHeaderScrolledToTop}
      closePrompt={
        shouldShowCloseButton &&
        ![UpdateGovernanceStage.Success, UpdateGovernanceStage.Error].includes(
          stage,
        )
      }
      fullHeight
    >
      <div id="content">{content}</div>
    </Modal>
  );
}
