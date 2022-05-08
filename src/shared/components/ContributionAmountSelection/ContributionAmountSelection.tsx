import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { Button } from "../Button";
import {
  CurrencyInput,
  CurrencyInputVariant,
  ToggleButton,
  ToggleButtonGroup,
} from "../Form";
import { formatPrice } from "../../utils";
import { Orientation } from "@/shared/constants";
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
  currentAmount?: number;
  minFeeToJoin: number;
  zeroContribution: boolean;
  pricePostfix?: string;
  showFinishButton?: boolean;
  onChange: (
    amount: number | null,
    hasError: boolean,
    isSelection: boolean
  ) => void;
}

export default function ContributionAmountSelection(props: IProps) {
  const {
    className,
    contributionAmount,
    currentAmount,
    minFeeToJoin,
    zeroContribution,
    pricePostfix = "",
    showFinishButton = false,
    onChange,
  } = props;
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
  const amountsForSelection = useMemo(
    () => getAmountsForSelection(minFeeToJoin, zeroContribution, currentAmount),
    [minFeeToJoin, zeroContribution, currentAmount]
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
    onChange(null, true, false);
  }, [onChange]);

  const handleCurrencyInputBlur = useCallback(() => {
    setIsCurrencyInputTouched(true);
  }, []);

  const handleChange = useCallback(
    (value: unknown) => {
      const convertedValue = Number(value);

      if (Number.isNaN(convertedValue)) {
        setSelectedContribution("other");
        onChange(null, true, false);
        return;
      }

      setSelectedContribution(convertedValue);
      onChange(convertedValue, false, true);
    },
    [onChange]
  );

  const handleCurrencyInputChange = useCallback(
    (value: string | undefined) => {
      const hasError = Boolean(
        validateContributionAmount(minFeeToJoin, zeroContribution, value)
      );
      const convertedValue = Number(value);

      setEnteredContribution(value);
      onChange(
        !Number.isNaN(convertedValue) ? convertedValue * 100 : null,
        hasError,
        false
      );
    },
    [minFeeToJoin, zeroContribution, onChange]
  );

  const handleContinueClick = useCallback(() => {
    const convertedValue = Number(enteredContribution);

    onChange(
      !Number.isNaN(convertedValue) ? convertedValue * 100 : null,
      false,
      true
    );
  }, [enteredContribution, onChange]);

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
          variant={Orientation.vertical}
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
              {amount === currentAmount ? " - Current" : ""}
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
            label="Other"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={handleCurrencyInputChange}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "contribution-amount-selection__currency-input-label",
            }}
            variant={CurrencyInputVariant.Middle}
            allowDecimals={false}
            onCloseClick={handleBackToSelectionClick}
            autoFocus
            autoComplete="off"
          />
          {showFinishButton && (
            <Button
              className="contribution-amount-selection__continue-button"
              onClick={handleContinueClick}
              disabled={Boolean(currencyInputError)}
              shouldUseFullWidth
            >
              Continue to payment
            </Button>
          )}
        </>
      )}
    </div>
  );
}
