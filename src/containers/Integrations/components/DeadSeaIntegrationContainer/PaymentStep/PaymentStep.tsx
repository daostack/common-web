import React, { FC, useCallback, useEffect, useState } from "react";
import config from "@/config";
import { Loader } from "@/shared/components";
import {
  useImmediateContribution,
  useUserCards,
} from "@/shared/hooks/useCases";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import { AmountSelection } from "./AmountSelection";
import { PaymentDetails } from "./PaymentDetails";
import { ContributionType } from "@/shared/constants";
import { ErrorText } from "@/shared/components/Form";
import "./index.scss";

interface PaymentStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const { amount, onAmountChange } = props;
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
      amount,
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
