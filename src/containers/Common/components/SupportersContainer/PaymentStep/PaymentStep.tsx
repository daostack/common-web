import React, { FC, useCallback, useEffect, useState } from "react";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { ContributionType } from "@/shared/constants";
import {
  useImmediateContribution,
  useUserCards,
} from "@/shared/hooks/useCases";
import { Currency } from "@/shared/models";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import { PaymentDetails } from "./PaymentDetails";
import "./index.scss";

interface PaymentStepProps {
  amount: number;
  onAmountChange: (amount: number) => void;
  onFinish: () => void;
  onUserDetailsEdit: () => void;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const { amount, onAmountChange, onFinish, onUserDetailsEdit } = props;
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
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const [isAmountEditing, setIsAmountEditing] = useState(false);
  const commonId = supportersData?.commonId;

  const handleImmediateContribution = useCallback(() => {
    if (commonId) {
      makeImmediateContribution({
        commonId,
        price: { amount, currency: Currency.ILS },
        contributionType: ContributionType.OneTime,
      });
    }
  }, [makeImmediateContribution, amount, commonId]);

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

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper
      title={currentTranslation.title}
      onGoBack={isAmountEditing ? stopAmountEditing : null}
    >
      {!areUserCardsFetched && <Loader />}
      {areUserCardsFetched &&
        (isAmountEditing ? (
          <AmountSelection
            amount={amount}
            minAmount={supportersData?.minAmount}
            amountsToSelect={supportersData?.amounts || []}
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
            onUserDetailsEdit={onUserDetailsEdit}
          />
        ))}
      {errorText && (
        <ErrorText className="supporters-page-payment-step__error">
          {errorText}
        </ErrorText>
      )}
    </GeneralInfoWrapper>
  );
};

export default PaymentStep;
