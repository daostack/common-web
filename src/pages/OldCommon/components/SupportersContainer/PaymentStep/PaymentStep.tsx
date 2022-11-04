import React, { FC, useCallback, useEffect, useState } from "react";
import { useSupportersDataContext } from "@/pages/OldCommon/containers/SupportersContainer/context";
import { Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import {
  ContributionType,
  MIN_CONTRIBUTION_ILS_AMOUNT,
} from "@/shared/constants";
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
  contributionType: ContributionType;
  onAmountChange: (amount: number, contributionType: ContributionType) => void;
  onFinish: () => void;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const { amount, contributionType, onAmountChange, onFinish } = props;
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
        contributionType,
      });
    }
  }, [makeImmediateContribution, amount, commonId, contributionType]);

  const startAmountEditing = () => {
    setIsAmountEditing(true);
  };

  const stopAmountEditing = () => {
    setIsAmountEditing(false);
  };

  const handleAmountChange = (
    newAmount: number,
    contributionType: ContributionType,
  ) => {
    onAmountChange(newAmount, contributionType);
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
            contributionType={contributionType}
            minOneTimeAmount={
              supportersData?.minAmount || MIN_CONTRIBUTION_ILS_AMOUNT
            }
            minMonthlyAmount={
              supportersData?.minMonthlyAmount || MIN_CONTRIBUTION_ILS_AMOUNT
            }
            oneTimeAmountsToSelect={supportersData?.amounts || []}
            monthlyAmountsToSelect={supportersData?.monthlyAmounts || []}
            onAmountChange={handleAmountChange}
          />
        ) : (
          <PaymentDetails
            amount={amount}
            contributionType={contributionType}
            cards={cards}
            isPaymentLoading={isPaymentLoading}
            intermediatePayment={intermediatePayment}
            onPay={handleImmediateContribution}
            onIframeLoaded={onReadyToSubscribe}
            onAmountEdit={startAmountEditing}
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
