import React, { useCallback, useState } from "react";
import {
  CurrencyInput,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupVariant,
} from "@/shared/components/Form";
import classNames from "classnames";
import { formatPrice } from "@/shared/utils";
import { ButtonLink } from "@/shared/components";
import "./index.scss";

interface IProps {
  enteredContribution: string | undefined;
  setEnteredContribution: (enteredContribution: string | undefined) => void;
  selectedContribution: number | "other" | null;
  setSelectedContribution: (
    selectedContribution: number | "other" | null
  ) => void;
  isMonthlyContribution: boolean;
  amountsForSelection: number[];
  pricePostfix: string;
  formattedMinFeeToJoin: string;
  currencyInputError: string;
}

export default function ContributionAmountSelection(props: IProps) {
  const {
    enteredContribution,
    setEnteredContribution,
    selectedContribution,
    setSelectedContribution,
    isMonthlyContribution,
    amountsForSelection,
    pricePostfix,
    formattedMinFeeToJoin,
    currencyInputError,
  } = props;
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
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
    default: "create-common-contribution__toggle-button",
  };
  return (
    <>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className={classNames(
            "create-common-contribution__toggle-button-group",
            {
              "create-common-contribution__toggle-button-group--one-time": !isMonthlyContribution,
            }
          )}
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
        <div className="create-common-contribution__currency-input-wrapper">
          <CurrencyInput
            name="contributionAmount"
            label="Contribution amount"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={setEnteredContribution}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "create-common-contribution__currency-input-label",
            }}
            allowDecimals={false}
          />
          <ButtonLink
            className="create-common-contribution__back-to-selection"
            onClick={handleBackToSelectionClick}
          >
            Back to amount selection
          </ButtonLink>
        </div>
      )}
    </>
  );
}