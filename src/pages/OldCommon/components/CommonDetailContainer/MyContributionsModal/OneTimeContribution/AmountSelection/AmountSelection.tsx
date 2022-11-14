import React, { useEffect, FC } from "react";
import { ContributionAmountSelection, Separator } from "@/shared/components";
import { MIN_CONTRIBUTION_ILS_AMOUNT } from "@/shared/constants";
import { commonTypeText } from "@/shared/utils";
import "./index.scss";

interface AmountSelectionProps {
  minSelectionAmount?: number;
  contributionAmount?: number;
  onSelect: (amount: number) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
  isSubCommon: boolean;
}

const AmountSelection: FC<AmountSelectionProps> = (props) => {
  const {
    minSelectionAmount = MIN_CONTRIBUTION_ILS_AMOUNT,
    contributionAmount,
    onSelect,
    setShouldShowGoBackButton,
    isSubCommon,
  } = props;

  const handleChange = (
    amount: number | null,
    hasError: boolean,
    isSelection: boolean,
  ) => {
    if (amount !== null && isSelection) {
      onSelect(amount);
    }
  };

  useEffect(() => {
    setShouldShowGoBackButton(true);
  }, [setShouldShowGoBackButton]);

  return (
    <section className="one-time-amount-selection-my-contributions-stage">
      <h3 className="one-time-amount-selection-my-contributions-stage__title">
        Make one-time contribution
      </h3>
      <p className="one-time-amount-selection-my-contributions-stage__description">
        Select the amount for your one-time contribution to this{" "}
        {commonTypeText(isSubCommon)}. The funds will be added to the{" "}
        {commonTypeText(isSubCommon)} balance.
      </p>
      <Separator className="one-time-amount-selection-my-contributions-stage__separator" />
      <ContributionAmountSelection
        contributionAmount={contributionAmount}
        minimalAmount={minSelectionAmount}
        onChange={handleChange}
        showFinishButton
      />
    </section>
  );
};

export default AmountSelection;
