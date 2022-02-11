import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { ButtonLink } from "../ButtonLink";
import {
  CurrencyInput,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupVariant,
} from "../Form";
import { formatPrice } from "../../utils";
import {
  getAmountsForSelection,
  getInitialEnteredContributionValue,
  getInitialSelectedContributionValue,
  validateContributionAmount,
} from "./helpers";
import "./index.scss";

interface IProps {
  className?: string;
  contributionAmount?: number;
  minFeeToJoin: number;
  zeroContribution: boolean;
  pricePostfix: string;
}

export default function ContributionAmountSelection(props: IProps) {
  const {
    className,
    contributionAmount,
    minFeeToJoin,
    zeroContribution,
    pricePostfix,
  } = props;
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
  const amountsForSelection = useMemo(
    () => getAmountsForSelection(minFeeToJoin, zeroContribution),
    [minFeeToJoin, zeroContribution]
  );
  const [selectedContribution, setSelectedContribution] = useState<
    number | "other" | null
  >(() =>
    getInitialSelectedContributionValue(amountsForSelection, contributionAmount)
  );
  const [enteredContribution, setEnteredContribution] = useState<
    string | undefined
  >(() =>
    getInitialEnteredContributionValue(selectedContribution, contributionAmount)
  );
  const formattedMinFeeToJoin = formatPrice(
    zeroContribution ? 0 : minFeeToJoin,
    { shouldMillify: false, shouldRemovePrefixFromZero: false }
  );
  const currencyInputError = validateContributionAmount(
    minFeeToJoin,
    zeroContribution,
    enteredContribution
  );

  const handleBackToSelectionClick = useCallback(() => {
    setSelectedContribution(null);
    setEnteredContribution(undefined);
  }, []);

  const handleCurrencyInputBlur = useCallback(() => {
    setIsCurrencyInputTouched(true);
  }, []);

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(
      !Number.isNaN(convertedValue) ? convertedValue : "other"
    );
  }, []);

  const toggleButtonStyles = {
    default: "contribution-amount-selection__toggle-button",
  };

  return (
    <div className={classNames("contribution-amount-selection", className)}>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className="contribution-amount-selection__toggle-button-group"
          value={selectedContribution}
          onChange={handleChange}
          variant={ToggleButtonGroupVariant.Vertical}
        >
          {amountsForSelection.map((amount) => (
            <ToggleButton
              key={amount}
              styles={toggleButtonStyles}
              value={amount}
            >
              {formatPrice(amount, {
                shouldMillify: false,
                shouldRemovePrefixFromZero: false,
              })}
              {pricePostfix}
            </ToggleButton>
          ))}
          <ToggleButton styles={toggleButtonStyles} value="other">
            Other
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      {selectedContribution === "other" && (
        <>
          <CurrencyInput
            name="contributionAmount"
            label="Contribution amount"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={setEnteredContribution}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "contribution-amount-selection__currency-input-label",
            }}
            allowDecimals={false}
          />
          <ButtonLink
            className="contribution-amount-selection__back-to-selection"
            onClick={handleBackToSelectionClick}
          >
            Back to amount selection
          </ButtonLink>
        </>
      )}
    </div>
  );
}
