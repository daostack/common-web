import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Dots } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import {
  IntermediateCreateCommonPayload,
  PaymentPayload,
} from "../../../../interfaces";
import { PersonalContribution } from "./PersonalContribution";
import { PROGRESS_RELATED_STEPS } from "./Progress";
import { PaymentStep } from "./constants";
import { RequestPayment } from "./RequestPayment";
import "./index.scss";

interface PaymentProps {
  isHeaderScrolledToTop: boolean;
  setTitle: (title: ReactNode) => void;
  setGoBackHandler: (handler?: (() => boolean | undefined) | null) => void;
  setShouldShowCloseButton: (shouldShow: boolean) => void;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
}

const INITIAL_DATA: PaymentPayload = {
  cardId: uuidv4(),
};

export default function Payment(props: PaymentProps) {
  const {
    isHeaderScrolledToTop,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    creationData,
  } = props;
  const [paymentData, setPaymentData] = useState<PaymentPayload>(INITIAL_DATA);
  const [step, setStep] = useState(PaymentStep.PersonalContribution);
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

  const handleFinish = useCallback(
    (data?: Partial<PaymentPayload>) => {
      if (data) {
        setPaymentData((nextData) => ({
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
    [step]
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
      paymentData,
      creationData,
      currentStep: step,
      onFinish: handleFinish,
    };

    switch (step) {
      case PaymentStep.PersonalContribution:
        return <PersonalContribution {...stepProps} />;
      case PaymentStep.PaymentDetails:
        return <RequestPayment {...stepProps} />;
      default:
        return null;
    }
  }, [paymentData, creationData, step, handleFinish]);

  return content;
}
