import React, { useCallback, useState } from "react";
import { CurrencyInput, ToggleButtonGroup, ToggleButton, ToggleButtonGroupVariant } from "../../../../../shared/components/Form";
import { ModalFooter } from "../../../../../shared/components/Modal";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

const MIN_CALCULATION_AMOUNT = 2000;

const validateContributionAmount = (minFeeToJoin: number, value?: string): string => {
  const convertedValue = Number(value) * 100;

  if (convertedValue >= minFeeToJoin && (convertedValue === 0 || convertedValue >= 500)) {
    return "";
  }

  const errorTexts = ["The amount must be"];


  if (minFeeToJoin === 0) {
    errorTexts.push("0, or");
    errorTexts.push(`at least ${formatPrice(500)}`);
  } else {
    errorTexts.push(`at least ${formatPrice(minFeeToJoin)}`);
  }

  return errorTexts.join(" ");
};

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const isMonthlyContribution = common?.metadata.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;
  const secondAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 2000 : (minFeeToJoin + 1000);
  const thirdAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 5000 : (minFeeToJoin + 2000);
  const [selectedContribution, setSelectedContribution] = useState<number | "other" | null>(() => {
    if (userData.contribution_amount === undefined) {
      return null;
    }

    return (
      [minFeeToJoin, secondAmount, thirdAmount].includes(userData.contribution_amount)
        ? userData.contribution_amount
        : "other"
    );
  });
  const [enteredContribution, setEnteredContribution] = useState<string | undefined>(() => (
    selectedContribution === "other" ? String((userData.contribution_amount || 0) / 100) : undefined
  ));
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin);
  const pricePostfix = isMonthlyContribution ? "/mo" : "";
  const currencyInputError = validateContributionAmount(minFeeToJoin, enteredContribution);
  const isSubmitDisabled = Boolean(
    selectedContribution === "other"
      ? currencyInputError
      : selectedContribution === null
  );

  const handleCurrencyInputBlur = useCallback(() => {
    setIsCurrencyInputTouched(true);
  }, []);

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(!Number.isNaN(convertedValue) ? convertedValue : "other");
  }, []);

  const handleSubmit = useCallback(() => {
    const contributionAmount = selectedContribution === "other" ? Number(enteredContribution) * 100 : selectedContribution;

    setUserData({ ...userData, contribution_amount: contributionAmount, stage: 4 });
  }, [setUserData, userData, selectedContribution, enteredContribution]);

  const toggleButtonStyles = { default: "membership-request-contribution__toggle-button" };

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">{isMonthlyContribution ? "Monthly" : "Personal"} Contribution</div>
      <div className="sub-text membership-request-contribution__description">
        Select the amount you would like to contribute{isMonthlyContribution ? " each month" : ""} ({formattedMinFeeToJoin}{pricePostfix} min.)
      </div>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className="membership-request-contribution__toggle-button-group"
          value={selectedContribution}
          onChange={handleChange}
          variant={ToggleButtonGroupVariant.Vertical}
        >
          <ToggleButton
            styles={toggleButtonStyles}
            value={minFeeToJoin}
          >
            {formatPrice(minFeeToJoin)}{pricePostfix}
          </ToggleButton>
          <ToggleButton
            styles={toggleButtonStyles}
            value={secondAmount}
          >
            {formatPrice(secondAmount)}{pricePostfix}
          </ToggleButton>
          <ToggleButton
            styles={toggleButtonStyles}
            value={thirdAmount}
          >
            {formatPrice(thirdAmount)}{pricePostfix}
          </ToggleButton>
          <ToggleButton
            styles={toggleButtonStyles}
            value="other"
          >
            Other
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      {selectedContribution === "other" && (
        <div className="membership-request-contribution__currency-input-wrapper">
          <CurrencyInput
            name="contributionAmount"
            label="Contribution amount"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={setEnteredContribution}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "membership-request-contribution__currency-input-label",
            }}
          />
        </div>
      )}
      {isMonthlyContribution && (
        <span className="membership-request-contribution__hint">You can cancel the recurring payment at any time</span>
      )}
      <ModalFooter sticky>
        <div className="membership-request-contribution__modal-footer">
          <button
            disabled={isSubmitDisabled}
            className="button-blue"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </ModalFooter>
    </div>
  );
}
