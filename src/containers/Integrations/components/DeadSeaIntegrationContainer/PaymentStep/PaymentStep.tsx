import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "@/config";
import { selectUser } from "@/containers/Auth/store/selectors";
import { useCommonMember } from "@/containers/Common/hooks";
import { createMemberAdmittanceProposal } from "@/containers/Common/store/actions";
import { Loader } from "@/shared/components";
import { MemberAdmittance } from "@/shared/models/governance/proposals";
import { getUserName } from "@/shared/utils";
import {
  useImmediateContribution,
  useUserCards,
} from "@/shared/hooks/useCases";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import { PaymentDetails } from "./PaymentDetails";
import { ContributionType } from "@/shared/constants";

interface PaymentStepProps {
  amount: number;
}

const PaymentStep: FC<PaymentStepProps> = (props) => {
  const { amount } = props;
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
    onReadyToSubscribe,
  } = useImmediateContribution();

  const handleImmediateContribution = useCallback(() => {
    makeImmediateContribution({
      amount,
      commonId: config.deadSeaCommonId,
      contributionType: ContributionType.OneTime,
    });
  }, [makeImmediateContribution, amount]);

  useEffect(() => {
    fetchUserCards();
  }, [fetchUserCards]);

  useEffect(() => {
    if (areUserCardsFetched && cards.length === 0) {
      handleImmediateContribution();
    }
  }, [areUserCardsFetched, cards.length, handleImmediateContribution]);

  return (
    <GeneralInfoWrapper>
      {!areUserCardsFetched && <Loader />}
      {areUserCardsFetched && (
        <PaymentDetails
          amount={amount}
          cards={cards}
          isPaymentLoading={isPaymentLoading}
          intermediatePayment={intermediatePayment}
          onPay={handleImmediateContribution}
          onIframeLoaded={onReadyToSubscribe}
        />
      )}
    </GeneralInfoWrapper>
  );
};

export default PaymentStep;
