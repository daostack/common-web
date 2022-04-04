import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";
import { useSelector, useDispatch, } from "react-redux";
import { Dots } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Common } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { PaymentPayload } from "../../../../interfaces";
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
  onError: (errorText: string) => void;
  common: Common;
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
    onError,
    common,
    paymentData,
    setPaymentData,
  } = props;
  const dispatch = useDispatch();
  const [step, setStep] = useState(PaymentStep.PersonalContribution);
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonTitle = common.name;

  const scrollTop = () => {
    const content = document.getElementById("content");

    if (content) content.scrollIntoView(true);
  };

  const handleGoBack = useCallback((): boolean => {
    if (step !== PaymentStep.PersonalContribution) {
      scrollTop();
      setShouldShowGoBackButton(false);
      setStep((step) => step - 1);
    }

    return false;
  }, [step]);

  const handleFinish = useCallback(
    (data?: Partial<PaymentPayload>) => {
      const nextStep = step + 1;
      const nextData = {
        ...paymentData,
        ...(data || {}),
      };

      if (data) {
        setPaymentData(nextData);
      }

      scrollTop();

      if (
        step === PaymentStep.PaymentDetails ||
        (nextStep === PaymentStep.PaymentDetails &&
          nextData.contributionAmount === 0)
      ) {
        onFinish();
        return;
      }

      setStep(nextStep);
    },
    [onFinish, step, paymentData, setPaymentData]
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
    setGoBackHandler(shouldShowGoBackButton ? handleGoBack : null);
  }, [setGoBackHandler, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowCloseButton(false);
  }, [setShouldShowCloseButton]);

  const content = useMemo(() => {
    const stepProps = {
      paymentData,
      common,
      currentStep: step,
      onFinish: handleFinish,
    };

    switch (step) {
      case PaymentStep.PersonalContribution:
        return <PersonalContribution {...stepProps} />;
      case PaymentStep.PaymentDetails:
        return (
          <RequestPayment
            {...stepProps}
            onError={onError}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      default:
        return null;
    }
  }, [paymentData, common, step, handleFinish, onError]);

  return content;
}
