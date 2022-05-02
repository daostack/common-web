import React, { useEffect, FC } from "react";
import classNames from "classnames";
import { ContributionAmountSelection, Separator } from "@/shared/components";
import { Common } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import "./index.scss";

export interface Styles {
  container?: string;
}

interface AmountSelectionProps {
  common: Common;
  currentAmount: number;
  onSelect: (amount: number) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
  styles?: Styles;
}

const AmountSelection: FC<AmountSelectionProps> = (props) => {
  const {
    common,
    currentAmount,
    onSelect,
    setShouldShowGoBackButton,
    styles,
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
    <section
      className={classNames(
        "change-monthly-amount-selection-my-contributions-stage",
        styles?.container
      )}
    >
      <h3 className="change-monthly-amount-selection-my-contributions-stage__title">
        Change monthly contribution amount
      </h3>
      <p className="change-monthly-amount-selection-my-contributions-stage__description">
        Select the amount for your monthly contribution to this Common. The
        minimum contribution to this Common is {formatPrice(minFeeToJoin)}{" "}
        monthly.
      </p>
      <Separator className="change-monthly-amount-selection-my-contributions-stage__separator" />
      <p className="change-monthly-amount-selection-my-contributions-stage__hint">
        The change will apply starting from the next charge.
      </p>
      <ContributionAmountSelection
        minFeeToJoin={minFeeToJoin}
        zeroContribution={false}
        currentAmount={currentAmount}
        pricePostfix="/mo"
        onChange={handleChange}
        showFinishButton
      />
      <p className="change-monthly-amount-selection-my-contributions-stage__hint">
        You can cancel the recurring payment at any time
      </p>
    </section>
  );
};

export default AmountSelection;
