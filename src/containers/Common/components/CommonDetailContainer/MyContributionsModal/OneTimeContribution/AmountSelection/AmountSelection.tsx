import React, { useEffect, FC } from "react";
import { ContributionAmountSelection, Separator } from "@/shared/components";
import { Common } from "@/shared/models";
import "./index.scss";

interface AmountSelectionProps {
  common: Common;
  contributionAmount?: number;
  onSelect: (amount: number) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const AmountSelection: FC<AmountSelectionProps> = (props) => {
  const {
    common,
    contributionAmount,
    onSelect,
    setShouldShowGoBackButton,
  } = props;
  const {
    metadata: { minFeeToJoin },
  } = common;

  const handleChange = (
    amount: number | null,
    hasError: boolean,
    isSelection: boolean
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
        Select the amount for your one-time contribution to this Common. The
        funds will be added to the Common balance.
      </p>
      <Separator className="one-time-amount-selection-my-contributions-stage__separator" />
      <p className="one-time-amount-selection-my-contributions-stage__hint">
        The change will apply starting from the next charge.
      </p>
      <ContributionAmountSelection
        contributionAmount={contributionAmount}
        minFeeToJoin={minFeeToJoin}
        zeroContribution={false}
        onChange={handleChange}
        showFinishButton
      />
    </section>
  );
};

export default AmountSelection;
