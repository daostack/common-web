import React, { useCallback, useEffect, useMemo, useState, FC } from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Loader } from "@/shared/components";
import { useComponentWillUnmount } from "@/shared/hooks";
import { Card } from "@/shared/models";
import { loadUserCards } from "../../../../store/actions";
import { useMyContributionsContext } from "../context";
import { PaymentMethod } from "./PaymentMethod";
import { PaymentMethodChange } from "./PaymentMethodChange";
import { ReplacePaymentMethodStep } from "./constants";

interface ReplacePaymentMethodProps {
  userCardId: string;
  goBack: () => void;
}

const ReplacePaymentMethod: FC<ReplacePaymentMethodProps> = (props) => {
  const { userCardId, goBack } = props;
  const { setTitle, setOnGoBack, onError, setShouldShowClosePrompt } =
    useMyContributionsContext();
  const dispatch = useDispatch();
  const [step, setStep] = useState<ReplacePaymentMethodStep>(
    ReplacePaymentMethodStep.PaymentMethod,
  );
  const [shouldShowGoBackButton, setShouldShowGoBackButton] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [isCardLoadingStarted, setIsCardLoadingStarted] = useState(false);
  const cardId = useMemo(() => uuidv4(), []);

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

  const handleReplacePaymentMethod = useCallback(() => {
    setStep(ReplacePaymentMethodStep.Payment);
  }, []);

  useEffect(() => {
    if (isCardLoadingStarted) {
      return;
    }

    setIsCardLoadingStarted(true);
    dispatch(
      loadUserCards.request({
        callback: (error, cards) => {
          if (error || !cards) {
            onError(error?.message ?? "Something went wrong :/");
          } else {
            setCards(cards);
          }
        },
      }),
    );
  }, [dispatch, isCardLoadingStarted, userCardId, onError]);

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
        return cards.length > 0 ? (
          <PaymentMethod
            card={cards[0]}
            onReplacePaymentMethod={handleReplacePaymentMethod}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        ) : (
          <Loader />
        );
      case ReplacePaymentMethodStep.Payment:
        return (
          <PaymentMethodChange
            cardId={cardId}
            onFinish={goBack}
            onError={onError}
            setShouldShowGoBackButton={setShouldShowGoBackButton}
          />
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default ReplacePaymentMethod;
