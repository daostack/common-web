import React, { useCallback, useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Subscription, Payment } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { useMyContributionsContext } from "../context";
import { AmountSelection } from "./AmountSelection";
import { Payment as PaymentStep } from "./Payment";
import { Success } from "./Success";
import { CreateSubscriptionStep } from "./constants";
import "./index.scss";

interface CreateSubscriptionProps {
  common: Common;
  onFinish: (subscription: Subscription) => void;
  goBack: () => void;
  onLoadingToggle?: (isLoading: boolean) => void;
}

const CreateSubscription: FC<CreateSubscriptionProps> = (props) => {
  const { common, onFinish, goBack } = props;
  const { setTitle, setOnGoBack, onError, setShouldShowClosePrompt } =
    useMyContributionsContext();
  const [step, setStep] = useState<CreateSubscriptionStep>(
    CreateSubscriptionStep.AmountSelection,
  );
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [createdPayment, setCreatedPayment] = useState<
    Subscription | Payment | null
  >(null);
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();

  const handleAmountSelect = (amount: number) => {
    setContributionAmount(amount);
    setStep(CreateSubscriptionStep.Payment);
  };

  const handleGoBack = useCallback(() => {
    if (step === CreateSubscriptionStep.AmountSelection) {
      goBack();
    } else {
      setStep((nextStep) => nextStep - 1);
    }
  }, [goBack, step]);

  const handleUnmount = useCallback(() => {
    setShouldShowClosePrompt(false);
  }, [setShouldShowClosePrompt]);

  const handlePaymentFinish = useCallback((payment: Subscription | Payment) => {
    setCreatedPayment(payment);
  }, []);

  const handleSuccessFinish = useCallback(() => {
    if (createdPayment) {
      onFinish(createdPayment as Subscription);
    }
  }, [onFinish, createdPayment]);

  useEffect(() => {
    setTitle(!isMobileView && createdPayment ? null : "My contributions");
  }, [setTitle, isMobileView, createdPayment]);

  useEffect(() => {
    setOnGoBack(shouldShowGoBackButton ? handleGoBack : undefined);
  }, [setOnGoBack, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(false);
  }, [setShouldShowClosePrompt]);

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
      case CreateSubscriptionStep.AmountSelection:
        return (
          <AmountSelection
            contributionAmount={contributionAmount}
            onSelect={handleAmountSelect}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      case CreateSubscriptionStep.Payment:
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

export default CreateSubscription;
