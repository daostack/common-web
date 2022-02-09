import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Dots } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { IntermediateCreateCommonPayload } from "../../../../interfaces";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { PaymentStep } from "./constants";
import { PersonalContribution } from "./PersonalContribution";
import "./index.scss";

interface CreationStepsProps {
  isHeaderScrolledToTop: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
  setCreationData: Dispatch<SetStateAction<IntermediateCreateCommonPayload>>;
  setShouldContinueFromReviewStep: (ShouldContinueFromReviewStep: boolean) => void
}

export default function Payment(props: CreationStepsProps) {
  const {
    isHeaderScrolledToTop,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    creationData,
    setCreationData,
    setShouldContinueFromReviewStep
  } = props;
  const [stage, setStage] = useState(PaymentStep.PersonalContribution);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonTitle = creationData.name ? creationData.name : "Create a Common";

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback(() => {
    if (stage === PaymentStep.PersonalContribution) {
      return true;
    }
    scrollTop();
    setStage((step) => step - 1);
  }, [stage]);

  const moveStageForward = useCallback(() => {
    setStage((stage) => stage + 1);
  }, []);

  const handleFinish = useCallback(
    (data?: Partial<IntermediateCreateCommonPayload>) => {
      if (data) {
        setCreationData((nextData) => ({
          ...nextData,
          ...data,
        }));
      }
      if (stage === PaymentStep.PaymentDetails) {
        return;
      }
      scrollTop();
      setStage((stage) => stage + 1);
    },
    [stage, setCreationData]
  );

  const title = useMemo(() => {
    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
      (progressStep) => progressStep === stage
    );

    return (
      <div className="create-common-payment-steps__modal-title-wrapper">
        {isMobileView && !isHeaderScrolledToTop && stepIndex !== -1 && (
          <Dots
            className="create-common-payment-steps__modal-title-dots"
            currentStep={stepIndex + 1}
            stepsAmount={PROGRESS_RELATED_STEPS.length}
            shouldHighlightUnfinishedSteps
          />
        )}
        <h3 className="create-common-payment-steps__modal-title">
          {commonTitle}
        </h3>
      </div>
    );
  }, [commonTitle, isMobileView, isHeaderScrolledToTop, stage]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(handleGoBack);
  }, [setGoBackHandler, handleGoBack]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  useEffect(() => {
    setShouldContinueFromReviewStep(true);
  }, [setShouldContinueFromReviewStep]);

  const content = useMemo(() => {
    const stepProps = {
      creationData,
      currentStep: stage,
      onFinish: moveStageForward,
    };

    switch (stage) {
      case PaymentStep.PersonalContribution:
        return (
          <PersonalContribution
            {...stepProps}
            onFinish={moveStageForward}
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
          />
        );
      case PaymentStep.PaymentDetails:
        return <></>;
      default:
        return null;
    }
  }, [moveStageForward, selectedAmount, stage, creationData]);

  return content;
}
