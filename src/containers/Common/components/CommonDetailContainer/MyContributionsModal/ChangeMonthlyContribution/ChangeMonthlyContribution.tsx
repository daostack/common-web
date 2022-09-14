import React, { useCallback, useEffect, useState, FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Common, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { updateSubscription } from "../../../../store/actions";
import { useMyContributionsContext } from "../context";
import { AmountSelection, AmountSelectionStyles } from "./AmountSelection";
import { Success } from "./Success";
import { ChangeMonthlyContributionStep } from "./constants";
import "./index.scss";

interface Styles {
  amountSelection?: AmountSelectionStyles;
}

interface ChangeMonthlyContributionProps {
  currentSubscription: Subscription;
  common: Common;
  onFinish: (subscription: Subscription) => void;
  goBack: () => void;
  onLoadingToggle?: (isLoading: boolean) => void;
  styles?: Styles;
}

const ChangeMonthlyContribution: FC<ChangeMonthlyContributionProps> = (
  props
) => {
  const { currentSubscription, onFinish, goBack, onLoadingToggle, styles } =
    props;
  const { setTitle, setOnGoBack, onError, setShouldShowClosePrompt } =
    useMyContributionsContext();
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
    if (currentSubscription.price.amount === amount) {
      onFinish(currentSubscription);
      return;
    }

    setIsLoading(true);
    if (onLoadingToggle) {
      onLoadingToggle(true);
    }

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
          if (onLoadingToggle) {
            onLoadingToggle(false);
          }
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
            currentAmount={currentSubscription.price.amount}
            onSelect={handleAmountSelect}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
            styles={styles?.amountSelection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="change-monthly-contribution__loader-wrapper">
          <Loader />
        </div>
      ) : (
        renderContent()
      )}
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
