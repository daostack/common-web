import React, { useCallback, useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Payment } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { useMyContributionsContext } from "../context";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentMethodChange } from "./PaymentMethodChange";
import { ReplacePaymentMethodStep } from "./constants";

interface ReplacePaymentMethodProps {
  common: Common;
  goBack: () => void;
}

const ReplacePaymentMethod: FC<ReplacePaymentMethodProps> = (props) => {
  const { common, goBack } = props;
  const {
    setTitle,
    setOnGoBack,
    onError,
    setShouldShowClosePrompt,
  } = useMyContributionsContext();
  const [step, setStep] = useState<ReplacePaymentMethodStep>(
    ReplacePaymentMethodStep.PaymentMethod
  );
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleGoBack = useCallback(() => {
    if (step === ReplacePaymentMethodStep.PaymentMethod) {
      goBack();
    } else {
      setStep((nextStep) => nextStep - 1);
    }
  }, [goBack, step]);

  const handleUnmount = useCallback(() => {
    setShouldShowClosePrompt(false);
  }, [setShouldShowClosePrompt]);

  const handlePaymentFinish = useCallback((payment: Payment) => {
    setCreatedPayment(payment);
  }, []);

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

  useEffect(() => {
    setOnGoBack(shouldShowGoBackButton ? handleGoBack : undefined);
  }, [setOnGoBack, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(step === ReplacePaymentMethodStep.Payment);
  }, [step, setShouldShowClosePrompt]);

  useComponentWillUnmount(handleUnmount);

  const renderContent = () => {
    switch (step) {
      case ReplacePaymentMethodStep.PaymentMethod:
        return (
          <PaymentMethod
            common={common}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      case ReplacePaymentMethodStep.Payment:
        return typeof contributionAmount === "number" ? (
          <PaymentMethodChange
            common={common}
            contributionAmount={contributionAmount}
            onFinish={handlePaymentFinish}
            onError={onError}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        ) : null;
      default:
        return null;
    }
  };

  return renderContent();
};

export default ReplacePaymentMethod;
