import React, { useCallback, useState, Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ContributionAmountSelection,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { CommonContributionType } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { PaymentInitDataType } from "../Payment";
import { Progress } from "../Progress";
import "./index.scss";

interface IStageProps {
  paymentData: PaymentInitDataType;
  setPaymentData: Dispatch<SetStateAction<PaymentInitDataType>>;
  currentStep: number;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function PersonalContribution(props: IStageProps) {
  const {
    creationData,
    currentStep,
    onFinish,
    paymentData,
    setPaymentData,
  } = props;
  const [
    [selectedContribution, hasSelectedContributionError],
    setSelectedContributionState,
  ] = useState<[number | null, boolean]>([
    paymentData.selectedAmount ?? null,
    !paymentData.selectedAmount,
  ]);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const selectedAmount = paymentData.selectedAmount || 0;
  const isMonthlyContribution =
    creationData.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = creationData.contributionAmount * 100;
  const zeroContribution = creationData.zeroContribution || false;
  const formattedMinFeeToJoin = formatPrice(
    zeroContribution ? 0 : minFeeToJoin,
    { shouldMillify: false, shouldRemovePrefixFromZero: false }
  );
  const pricePostfix = isMonthlyContribution ? "/mo" : "";
  const isSubmitDisabled =
    hasSelectedContributionError || selectedContribution === null;

  const handleChange = useCallback(
    (amount: number | null, hasError: boolean) => {
      setSelectedContributionState([amount, hasError]);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (hasSelectedContributionError || selectedContribution === null) {
      return;
    }

    setPaymentData((nextPaymentData) => ({
      ...nextPaymentData,
      selectedAmount: selectedContribution,
    }));
    onFinish();
  }, [
    onFinish,
    setPaymentData,
    selectedContribution,
    hasSelectedContributionError,
  ]);

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <div className="create-common-contribution">
      {progressEl}
      <h4 className="create-common-contribution__sub-title">
        {isMonthlyContribution ? "Monthly" : "Personal"} Contribution
      </h4>
      <div className="create-common-contribution__sub-text-wrapper">
        <p className="create-common-contribution__sub-text-item">
          Select the amount you would like to contribute to this Common.
        </p>
        <p className="create-common-contribution__sub-text-item">
          Contribution to this Common ({formattedMinFeeToJoin}
          {pricePostfix} min.){" "}
          <span className="create-common-contribution__sub-text-item--bold">
            You will not be charged until another member joins{" "}
          </span>{" "}
          the Common.
        </p>
      </div>
      <Separator className="create-common-contribution__separator" />
      <ContributionAmountSelection
        contributionAmount={selectedAmount}
        minFeeToJoin={minFeeToJoin}
        zeroContribution={zeroContribution}
        pricePostfix={pricePostfix}
        onChange={handleChange}
      />
      {isMonthlyContribution && (
        <span className="create-common-contribution__hint">
          You can cancel the recurring payment at any time
        </span>
      )}
      <ModalFooter sticky>
        <div className="create-common-contribution__submit-button-wrapper">
          <Button
            key="personal-contribution-continue"
            className="create-common-contribution__submit-button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            shouldUseFullWidth={isMobileView}
          >
            Submit
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
}
