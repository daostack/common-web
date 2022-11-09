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
import { Governance, UnstructuredRules } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { UpdateGovernanceRulesData } from "../../../../interfaces";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { Review } from "./Review";
import { Rules } from "./Rules";
import { EditStep } from "./constants";
import "./index.scss";

interface EditStepsProps {
  initialRules: UnstructuredRules;
  isHeaderScrolledToTop: boolean;
  governance?: Governance;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  currentData: UpdateGovernanceRulesData;
  setCurrentData: Dispatch<SetStateAction<UpdateGovernanceRulesData>>;
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
    initialRules,
  } = props;
  const [step, setStep] = useState(() =>
    shouldStartFromLastStep ? EditStep.Review : EditStep.Rules,
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback(() => {
    if (step === EditStep.Rules) {
      return true;
    }
    scrollTop();
    setStep((step) => step - 1);
  }, [step]);

  const handleFinish = useCallback(
    (data?: Partial<UpdateGovernanceRulesData>) => {
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
    [onFinish, step, setCurrentData],
  );

  const title = useMemo(() => {
    if (!isMobileView) {
      return "";
    }

    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
      (progressStep) => progressStep === step,
    );

    return (
      <div className="update-governance-edit-steps__modal-title-wrapper">
        {isMobileView && !isHeaderScrolledToTop && stepIndex !== -1 && (
          <Dots
            className="update-governance-edit-steps__modal-title-dots"
            currentStep={stepIndex + 1}
            stepsAmount={PROGRESS_RELATED_STEPS.length}
            shouldHighlightUnfinishedSteps
          />
        )}
        <h3 className="update-governance-edit-steps__modal-title">
          Edit Common
        </h3>
      </div>
    );
  }, [isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(step !== EditStep.Rules ? handleGoBack : undefined);
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
      case EditStep.Rules:
        return <Rules {...stepProps} initialRules={initialRules} />;
      case EditStep.Review:
        return <Review {...stepProps} />;
      default:
        return null;
    }
  }, [step, governance, handleFinish, currentData]);

  return content;
}
