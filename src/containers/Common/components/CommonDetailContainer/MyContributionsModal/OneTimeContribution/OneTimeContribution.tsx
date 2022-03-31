import React, { useCallback, useEffect, useState, FC } from "react";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Payment } from "@/shared/models";
import { useMyContributionsContext } from "../context";
import { AmountSelection } from "./AmountSelection";
import { Payment as PaymentStep } from "./Payment";
import { Success } from "./Success";
import { OneTimeContributionStep } from "./constants";

interface OneTimeContributionProps {
  common: Common;
  onFinish: (payment: Payment) => void;
  goBack: () => void;
}

const OneTimeContribution: FC<OneTimeContributionProps> = (props) => {
  const { common, onFinish, goBack } = props;
  const {
    setTitle,
    setOnGoBack,
    onError,
    setShouldShowClosePrompt,
  } = useMyContributionsContext();
  const [step, setStep] = useState<OneTimeContributionStep>(
    OneTimeContributionStep.AmountSelection
  );
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);

  const handleAmountSelect = (amount: number) => {
    setContributionAmount(amount);
    setStep(OneTimeContributionStep.Payment);
  };

  const handleGoBack = useCallback(() => {
    if (step === OneTimeContributionStep.AmountSelection) {
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
    setStep(OneTimeContributionStep.Success);
  }, []);

  const handleSuccessFinish = useCallback(() => {
    if (createdPayment) {
      onFinish(createdPayment);
    }
  }, [onFinish]);

  useEffect(() => {
    setTitle(
      step === OneTimeContributionStep.Success ? null : "My contributions"
    );
  }, [setTitle, step]);

  useEffect(() => {
    setOnGoBack(shouldShowGoBackButton ? handleGoBack : undefined);
  }, [setOnGoBack, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(step === OneTimeContributionStep.Payment);
  }, [step, setShouldShowClosePrompt]);

  useComponentWillUnmount(handleUnmount);

  const renderContent = () => {
    switch (step) {
      case OneTimeContributionStep.AmountSelection:
        return (
          <AmountSelection
            common={common}
            contributionAmount={contributionAmount}
            onSelect={handleAmountSelect}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      case OneTimeContributionStep.Payment:
        return typeof contributionAmount === "number" ? (
          <PaymentStep
            common={common}
            contributionAmount={contributionAmount}
            onFinish={handlePaymentFinish}
            onError={onError}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        ) : null;
      case OneTimeContributionStep.Success:
        return (
          <Success
            onFinish={handleSuccessFinish}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default OneTimeContribution;
