import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import { useSelector } from "react-redux";
import { Dots } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { commonTypeText } from "@/shared/utils";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { Funding } from "./Funding";
import { GeneralInfo } from "./GeneralInfo";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { Review } from "./Review";
import { Rules } from "./Rules";
import { UserAcknowledgment } from "./UserAcknowledgment";
import { CreationStep } from "./constants";
import "./index.scss";

interface CreationStepsProps {
  isHeaderScrolledToTop: boolean;
  isSubCommonCreation: boolean;
  governance?: Governance;
  subCommons: Common[];
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
  setCreationData: Dispatch<SetStateAction<IntermediateCreateCommonPayload>>;
  shouldStartFromLastStep: boolean;
}

export default function CreationSteps(props: CreationStepsProps) {
  const {
    isHeaderScrolledToTop,
    isSubCommonCreation,
    governance,
    subCommons,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    creationData,
    setCreationData,
    shouldStartFromLastStep,
  } = props;
  const [step, setStep] = useState(() =>
    shouldStartFromLastStep ? CreationStep.Review : CreationStep.GeneralInfo,
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback(() => {
    if (step === CreationStep.GeneralInfo) {
      return true;
    }
    scrollTop();
    setStep((step) =>
      step === CreationStep.Review && isSubCommonCreation
        ? CreationStep.Rules
        : step - 1,
    );
  }, [step, isSubCommonCreation]);

  const handleFormValues = (
    data?: Partial<IntermediateCreateCommonPayload>,
  ) => {
    if (data) {
      setCreationData((nextData) => ({
        ...nextData,
        ...data,
      }));
    }
  };

  const handleFinish = useCallback(
    (data?: Partial<IntermediateCreateCommonPayload>) => {
      if (data) {
        setCreationData((nextData) => ({
          ...nextData,
          ...data,
        }));
      }

      scrollTop();

      if (step === CreationStep.Review) {
        onFinish();
      } else if (step === CreationStep.Rules && isSubCommonCreation) {
        setStep((step) => step + 2);
      } else {
        setStep((step) => step + 1);
      }
    },
    [onFinish, step, setCreationData],
  );

  const shouldShowTitle = useCallback(
    (): boolean => step !== CreationStep.UserAcknowledgment || isMobileView,
    [step, isMobileView],
  );

  const title = useMemo(() => {
    if (!shouldShowTitle()) {
      return "";
    }

    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
      (progressStep) => progressStep === step,
    );

    return (
      <div className="create-common-creation-steps__modal-title-wrapper">
        {isMobileView && !isHeaderScrolledToTop && stepIndex !== -1 && (
          <Dots
            className="create-common-creation-steps__modal-title-dots"
            currentStep={stepIndex + 1}
            stepsAmount={PROGRESS_RELATED_STEPS.length}
            shouldHighlightUnfinishedSteps
          />
        )}
        <h3 className="create-common-creation-steps__modal-title">
          Create a {commonTypeText(isSubCommonCreation)}
        </h3>
      </div>
    );
  }, [shouldShowTitle, isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(
      !isSubCommonCreation || step !== CreationStep.GeneralInfo
        ? handleGoBack
        : undefined,
    );
  }, [setGoBackHandler, isSubCommonCreation, handleGoBack, step]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  const content = useMemo(() => {
    const stepProps = {
      creationData,
      isSubCommonCreation,
      governance,
      subCommons,
      currentStep: step,
      onFinish: handleFinish,
    };

    switch (step) {
      case CreationStep.GeneralInfo:
        return <GeneralInfo {...stepProps} />;
      case CreationStep.UserAcknowledgment:
        return <UserAcknowledgment {...stepProps} />;
      case CreationStep.Rules:
        return <Rules {...stepProps} />;
      case CreationStep.Funding:
        return <Funding {...stepProps} />;
      case CreationStep.Review:
        return <Review {...stepProps} handleFormValues={handleFormValues} />;
      default:
        return null;
    }
  }, [step, isSubCommonCreation, governance, handleFinish, creationData]);

  return content;
}
