import React, { useCallback, useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Payment } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { useMyContributionsContext } from "../context";
import { AmountSelection } from "./AmountSelection";
import { Payment as PaymentStep } from "./Payment";
import { Success } from "./Success";
import { OneTimeContributionStep } from "./constants";

interface OneTimeContributionProps {
  common: Common;
  onFinish: (payment: Payment) => void;
  goBack: () => void;
  isSubCommon: boolean;
}

const OneTimeContribution: FC<OneTimeContributionProps> = (props) => {
  const { common, onFinish, goBack, isSubCommon } = props;
  const { setTitle, setOnGoBack, onError, setShouldShowClosePrompt } =
    useMyContributionsContext();
  const [step, setStep] = useState<OneTimeContributionStep>(
    OneTimeContributionStep.AmountSelection,
  );
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

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
  }, []);

  const handleSuccessFinish = useCallback(() => {
    if (createdPayment) {
      onFinish(createdPayment);
    }
  }, [onFinish, createdPayment]);

  useEffect(() => {
    setTitle(!isMobileView && createdPayment ? null : "My contributions");
  }, [setTitle, isMobileView, createdPayment]);

  useEffect(() => {
    setOnGoBack(shouldShowGoBackButton ? handleGoBack : undefined);
  }, [setOnGoBack, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(step === OneTimeContributionStep.Payment);
  }, [step, setShouldShowClosePrompt]);

  useComponentWillUnmount(handleUnmount);

  const renderContent = () => {
    if (!isMobileView && createdPayment) {
      return (
        <Success
          onFinish={handleSuccessFinish}
          setShouldShowGoBackButton={setShouldShowGoBackButton}
        />
      );
    }

    switch (step) {
      case OneTimeContributionStep.AmountSelection:
        return (
          <AmountSelection
            contributionAmount={contributionAmount}
            onSelect={handleAmountSelect}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
            isSubCommon={isSubCommon}
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
      default:
        return null;
    }
  };

  return (
    <>
      {renderContent()}
      {isMobileView && createdPayment && (
        <Success
          onFinish={handleSuccessFinish}
          setShouldShowGoBackButton={setShouldShowGoBackButton}
        />
      )}
    </>
  );
};

export default OneTimeContribution;
