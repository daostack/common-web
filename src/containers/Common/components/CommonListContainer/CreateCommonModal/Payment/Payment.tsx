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
import { v4 as uuidv4 } from "uuid";
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
  paymentData: PaymentPayload;
  setPaymentData: Dispatch<SetStateAction<PaymentPayload>>;
}

export default function Payment(props: PaymentProps) {
  const {
    isHeaderScrolledToTop,
    setTitle,
    setGoBackHandler,
    setShouldShowCloseButton,
    onFinish,
    creationData,
    paymentData,
    setPaymentData,
  } = props;
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
      setPaymentData({ cardId: uuidv4() });
      return true;
    }
    scrollTop();
    setStep((step) => step - 1);
  }, [step, setPaymentData]);

  const handleFinish = useCallback(
    (data?: Partial<PaymentPayload>) => {
      if (data) {
        setPaymentData((nextData) => ({
          ...nextData,
          ...data,
        }));
      }

      scrollTop();

      if (step === PaymentStep.PaymentDetails) {
        onFinish();
      } else {
        setStep((stage) => stage + 1);
      }
    },
    [onFinish, step, setPaymentData]
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
