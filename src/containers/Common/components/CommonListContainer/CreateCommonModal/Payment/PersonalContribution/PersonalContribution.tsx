import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ContributionAmountSelection,
  ModalFooter,
  Separator,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Common, CommonContributionType } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { PaymentPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import "./index.scss";

interface PersonalContributionProps {
  currentStep: number;
  onFinish: (data: Partial<PaymentPayload>) => void;
  paymentData: PaymentPayload;
  common: Common;
}

export default function PersonalContribution(props: PersonalContributionProps) {
  const { currentStep, onFinish, paymentData, common } = props;
  const {
    metadata: { contributionType, minFeeToJoin, zeroContribution = false },
  } = common;
  const [
    [selectedContribution, hasSelectedContributionError],
    setSelectedContributionState,
  ] = useState<[number | null, boolean]>([
    paymentData.contributionAmount ?? null,
    typeof paymentData.contributionAmount !== "number",
  ]);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isMonthlyContribution =
    contributionType === CommonContributionType.Monthly;
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

    onFinish({
      contributionAmount: selectedContribution,
    });
  }, [hasSelectedContributionError, selectedContribution, onFinish]);

  const progressEl = <Progress paymentStep={currentStep} />;

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
          {pricePostfix} min.)
        </p>
      </div>
      <Separator className="create-common-contribution__separator" />
      <ContributionAmountSelection
        contributionAmount={paymentData.contributionAmount}
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
