import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { updateSubscription } from "../../../../store/actions";
import { useMyContributionsContext } from "../context";
import { AmountSelection } from "./AmountSelection";
import { Payment as PaymentStep } from "./Payment";
import { Success } from "./Success";
import { CreateSubscriptionStep } from "./constants";
import {
  useSubscription,
  useUserCards,
} from "@/shared/hooks/useCases";
import "./index.scss";

interface CreateSubscriptionProps {
  common: Common;
  onFinish: (subscription: Subscription) => void;
  goBack: () => void;
  onLoadingToggle?: (isLoading: boolean) => void;
}

const CreateSubscription: FC<CreateSubscriptionProps> = (
  props
) => {
  const { common, onFinish, goBack, onLoadingToggle } =
    props;
  const { setTitle, setOnGoBack, onError, setShouldShowClosePrompt } =
    useMyContributionsContext();
  const dispatch = useDispatch();
  const [step, setStep] = useState<CreateSubscriptionStep>(
    CreateSubscriptionStep.AmountSelection
  );
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const [createdPayment, setCreatedPayment] = useState<Subscription | null>(null);
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

  const handlePaymentFinish = useCallback((payment: Subscription) => {
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
    setShouldShowClosePrompt(isLoading);
  }, [isLoading, setShouldShowClosePrompt]);

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
      {isLoading ? (
        <div className="create-monthly-contribution__loader-wrapper">
          <Loader />
        </div>
      ) : (
        renderContent()
      )}
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
