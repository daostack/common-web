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
import { UpdateCommonPayload } from "../../../../interfaces";
import { GeneralInfo } from "./GeneralInfo";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { Review } from "./Review";
import { Rules } from "./Rules";
import { EditStep } from "./constants";
import "./index.scss";

interface EditStepsProps {
  isHeaderScrolledToTop: boolean;
  governance?: Governance;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  currentData: UpdateCommonPayload;
  setCurrentData: Dispatch<SetStateAction<UpdateCommonPayload>>;
  shouldStartFromLastStep: boolean;
}

export default function EditSteps(props: EditStepsProps) {
  const {
    isHeaderScrolledToTop,
    governance,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    currentData,
    setCurrentData,
    shouldStartFromLastStep,
  } = props;
  const [step, setStep] = useState(() =>
    shouldStartFromLastStep ? EditStep.Review : EditStep.GeneralInfo
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback(() => {
    if (step === EditStep.GeneralInfo) {
      return true;
    }
    scrollTop();
    setStep((step) => step - 1);
  }, [step]);

  const handleFormValues = (data?: Partial<UpdateCommonPayload>) => {
    if (data) {
      setCurrentData((nextData) => ({
        ...nextData,
        ...data,
      }));
    }
  };

  const handleFinish = useCallback(
    (data?: Partial<UpdateCommonPayload>) => {
      if (data) {
        setCurrentData((nextData) => ({
          ...nextData,
          ...data,
        }));
      }

      scrollTop();

      if (step === EditStep.Review) {
        onFinish();
      } else {
        setStep((step) => step + 1);
      }
    },
    [onFinish, step, setCurrentData]
  );

  const shouldShowTitle = useCallback(
    (): boolean => isMobileView,
    [isMobileView]
  );

  const title = useMemo(() => {
    if (!shouldShowTitle()) {
      return "";
    }

    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
      (progressStep) => progressStep === step
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
          Edit Common
        </h3>
      </div>
    );
  }, [shouldShowTitle, isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(
      step !== EditStep.GeneralInfo
        ? handleGoBack
        : undefined
    );
  }, [setGoBackHandler, handleGoBack, step]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  const content = useMemo(() => {
    const stepProps = {
      currentData,
      governance,
      currentStep: step,
      onFinish: handleFinish,
    };

    switch (step) {
      case EditStep.GeneralInfo:
        return <GeneralInfo {...stepProps} />;
      /*case CreationStep.Rules:
        return <Rules {...stepProps} />;*/
      case EditStep.Review:
        return <Review {...stepProps} handleFormValues={handleFormValues} />;
      default:
        return null;
    }
  }, [step, governance, handleFinish, currentData]);

  return content;
}
