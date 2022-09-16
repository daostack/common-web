import React, { FC, useCallback, useEffect, useState } from "react";
import config from "@/config";
import { Loader } from "@/shared/components";
import {
  useImmediateContribution,
  useUserCards,
} from "@/shared/hooks/useCases";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import { PaymentDetails } from "./PaymentDetails";
import { ContributionType } from "@/shared/constants";
import { ErrorText } from "@/shared/components/Form";
import { Currency } from "@/shared/models";
import "./index.scss";

interface PaymentStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  onFinish: () => void;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const { amount, onAmountChange, onFinish } = props;
  const {
    fetched: areUserCardsFetched,
    data: cards,
    fetchUserCards,
  } = useUserCards();
  const {
    isPaymentLoading,
    intermediatePayment,
    payment,
    errorText,
    makeImmediateContribution,
    resetImmediateContribution,
    onReadyToSubscribe,
  } = useImmediateContribution();
  const [isAmountEditing, setIsAmountEditing] = useState(false);

  const handleImmediateContribution = useCallback(() => {
    makeImmediateContribution({
      price: { amount, currency: Currency.ILS },
      commonId: config.deadSeaCommonId,
      contributionType: ContributionType.OneTime,
    });
  }, [makeImmediateContribution, amount]);

  const startAmountEditing = () => {
    setIsAmountEditing(true);
  };

  const stopAmountEditing = () => {
    setIsAmountEditing(false);
  };

  const handleAmountChange = (newAmount: number) => {
    onAmountChange(newAmount);
    stopAmountEditing();

    if (amount !== newAmount && cards.length === 0) {
      resetImmediateContribution();
    }
  };

  useEffect(() => {
    fetchUserCards();
  }, [fetchUserCards]);

  useEffect(() => {
    if (areUserCardsFetched && cards.length === 0) {
      handleImmediateContribution();
    }
  }, [areUserCardsFetched, cards.length, handleImmediateContribution]);

  useEffect(() => {
    if (payment) {
      onFinish();
    }
  }, [payment]);

  return (
    <GeneralInfoWrapper onGoBack={isAmountEditing ? stopAmountEditing : null}>
      {!areUserCardsFetched && <Loader />}
      {areUserCardsFetched &&
        (isAmountEditing ? (
          <AmountSelection
            amount={amount}
            onAmountChange={handleAmountChange}
          />
        ) : (
          <PaymentDetails
            amount={amount}
            cards={cards}
            isPaymentLoading={isPaymentLoading}
            intermediatePayment={intermediatePayment}
            onPay={handleImmediateContribution}
            onIframeLoaded={onReadyToSubscribe}
            onAmountEdit={startAmountEditing}
          />
        ))}
      {errorText && (
        <ErrorText className="dead-sea-payment-step__error">
          {errorText}
        </ErrorText>
      )}
    </GeneralInfoWrapper>
  );
};

export default PaymentStep;
