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
import { PersonalContribution } from "./PersonalContribution";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { PaymentStep } from "./constants";
import "./index.scss";

interface CreationStepsProps {
  isHeaderScrolledToTop: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
  setCreationData: Dispatch<SetStateAction<IntermediateCreateCommonPayload>>;
}

export default function Payment(props: CreationStepsProps) {
  const {
    isHeaderScrolledToTop,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    creationData,
    setCreationData,
  } = props;
  const [step, setStep] = useState(PaymentStep.PersonalContribution);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonTitle = creationData.name;

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback(() => {
    if (step === PaymentStep.PersonalContribution) {
      return true;
    }
    scrollTop();
    setStep((step) => step - 1);
  }, [step]);

  const moveStageForward = useCallback(() => {
    setStep((stage) => stage + 1);
  }, []);

  const handleFinish = useCallback(
    (data?: Partial<IntermediateCreateCommonPayload>) => {
      if (data) {
        setCreationData((nextData) => ({
          ...nextData,
          ...data,
        }));
      }
      if (step === PaymentStep.PaymentDetails) {
        return;
      }
      scrollTop();
      setStep((stage) => stage + 1);
    },
    [step, setCreationData]
  );

  const title = useMemo(() => {
    const stepIndex = PROGRESS_RELATED_STEPS.findIndex(
      (progressStep) => progressStep === step
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
  }, [commonTitle, isMobileView, isHeaderScrolledToTop, step]);

  useEffect(() => {
    setTitle(title);
  }, [setTitle, title]);

  useEffect(() => {
    setGoBackHandler(handleGoBack);
  }, [setGoBackHandler, handleGoBack]);

  useEffect(() => {
    setShouldShowCloseButton(true);
  }, [setShouldShowCloseButton]);

  const content = useMemo(() => {
    const stepProps = {
      creationData,
      currentStep: step,
      onFinish: moveStageForward,
    };

    switch (step) {
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
  }, [moveStageForward, selectedAmount, step, creationData]);

  return content;
}
