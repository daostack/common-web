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
import { Success } from "./Success";
import { ChangeMonthlyContributionStep } from "./constants";

interface ChangeMonthlyContributionProps {
  currentSubscription: Subscription;
  common: Common;
  onFinish: (subscription: Subscription) => void;
  goBack: () => void;
}

const ChangeMonthlyContribution: FC<ChangeMonthlyContributionProps> = (
  props
) => {
  const { currentSubscription, common, onFinish, goBack } = props;
  const {
    setTitle,
    setOnGoBack,
    onError,
    setShouldShowClosePrompt,
  } = useMyContributionsContext();
  const dispatch = useDispatch();
  const [step, setStep] = useState<ChangeMonthlyContributionStep>(
    ChangeMonthlyContributionStep.AmountSelection
  );
  const [subscription, setSubscription] = useState<Subscription | null>();
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleAmountSelect = (amount: number) => {
    if (currentSubscription.amount === amount) {
      onFinish(currentSubscription);
      return;
    }

    setIsLoading(true);

    dispatch(
      updateSubscription.request({
        payload: {
          subscriptionId: currentSubscription.id,
          amount,
        },
        callback: (error, subscription) => {
          if (error || !subscription) {
            onError("Something went wrong");
          } else {
            setSubscription(subscription);
          }

          setIsLoading(false);
        },
      })
    );
  };

  const handleGoBack = useCallback(() => {
    if (step === ChangeMonthlyContributionStep.AmountSelection) {
      goBack();
    } else {
      setStep((nextStep) => nextStep - 1);
    }
  }, [goBack, step]);

  const handleUnmount = useCallback(() => {
    setShouldShowClosePrompt(false);
  }, [setShouldShowClosePrompt]);

  const handleSuccessFinish = useCallback(() => {
    if (subscription) {
      onFinish(subscription);
    }
  }, [onFinish, subscription]);

  useEffect(() => {
    setTitle(!isMobileView && subscription ? null : "My contributions");
  }, [setTitle, isMobileView, subscription]);

  useEffect(() => {
    setOnGoBack(shouldShowGoBackButton ? handleGoBack : undefined);
  }, [setOnGoBack, shouldShowGoBackButton, handleGoBack]);

  useEffect(() => {
    setShouldShowClosePrompt(isLoading);
  }, [isLoading, setShouldShowClosePrompt]);

  useComponentWillUnmount(handleUnmount);

  const renderContent = () => {
    if (!isMobileView && subscription) {
      return (
        <Success
          onFinish={handleSuccessFinish}
          setShouldShowGoBackButton={setShouldShowGoBackButton}
        />
      );
    }

    switch (step) {
      case ChangeMonthlyContributionStep.AmountSelection:
        return (
          <AmountSelection
            common={common}
            currentAmount={currentSubscription.amount}
            onSelect={handleAmountSelect}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? <Loader /> : renderContent()}
      {isMobileView && subscription && (
        <Success
          onFinish={handleSuccessFinish}
          setShouldShowGoBackButton={setShouldShowGoBackButton}
        />
      )}
    </>
  );
};

export default ChangeMonthlyContribution;
