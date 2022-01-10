import React, { useCallback, useMemo, useState } from "react";
import { ButtonLink } from "../../../../../shared/components";
import {
  CurrencyInput,
  ToggleButtonGroup,
  ToggleButton,
  ToggleButtonGroupVariant,
} from "../../../../../shared/components/Form";
import { ModalFooter } from "../../../../../shared/components/Modal";
import {
  MIN_CONTRIBUTION_ILS_AMOUNT,
  MAX_CONTRIBUTION_ILS_AMOUNT,
} from "../../../../../shared/constants/shared";
import {
  formatPrice,
  roundNumberToNextTenths,
} from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

const validateContributionAmount = (
  minFeeToJoin: number,
  value?: string
): string => {
  const convertedValue = Number(value) * 100;

  if (
    convertedValue >= minFeeToJoin &&
    (convertedValue === 0 ||
      (convertedValue >= MIN_CONTRIBUTION_ILS_AMOUNT &&
        convertedValue <= MAX_CONTRIBUTION_ILS_AMOUNT))
  ) {
    return "";
  }

  const errorTexts = ["The amount must be"];

  if (minFeeToJoin === 0) {
    errorTexts.push("0, or");
    errorTexts.push(
      `at least ${formatPrice(MIN_CONTRIBUTION_ILS_AMOUNT, false)}`
    );
  } else {
    errorTexts.push(`at least ${formatPrice(minFeeToJoin, false)}`);
  }

  errorTexts.push(
    `and at most ${formatPrice(MAX_CONTRIBUTION_ILS_AMOUNT, false)}`
  );

  return errorTexts.join(" ");
};

const getAmountsForSelection = (minFeeToJoin: number): number[] => {
  const initialAmount = (minFeeToJoin * 2) / 100;
  const firstAmount =
    initialAmount !== 0 && initialAmount % 10 === 0
      ? initialAmount
      : roundNumberToNextTenths(initialAmount);

  return [firstAmount, firstAmount * 2]
    .map((amount) => amount * 100)
    .filter((amount) => amount <= MAX_CONTRIBUTION_ILS_AMOUNT);
};

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const isMonthlyContribution =
    common?.metadata.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;

  const amountsForSelection = useMemo(
    () =>
      [
        minFeeToJoin ? minFeeToJoin : 0,
        ...getAmountsForSelection(minFeeToJoin),
      ].filter((v) => v),
    [minFeeToJoin]
  );
  const [selectedContribution, setSelectedContribution] = useState<
    number | "other" | null
  >(() => {
    if (userData.contributionAmount === undefined) {
      return null;
    }

    return amountsForSelection.includes(userData.contributionAmount)
      ? userData.contributionAmount
      : "other";
  });
  const [enteredContribution, setEnteredContribution] = useState<
    string | undefined
  >(() =>
    selectedContribution === "other"
      ? String((userData.contributionAmount || 0) / 100)
      : undefined
  );
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin, false);
  const pricePostfix = isMonthlyContribution ? "/mo" : "";
  const currencyInputError = validateContributionAmount(
    minFeeToJoin,
    enteredContribution
  );
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
    setSelectedContribution(
      !Number.isNaN(convertedValue) ? convertedValue : "other"
    );
  }, []);

  const handleBackToSelectionClick = useCallback(() => {
    setSelectedContribution(null);
    setEnteredContribution(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    const contributionAmount =
      selectedContribution === "other"
        ? Number(enteredContribution) * 100
        : (selectedContribution || 0);

    setUserData((nextUserData) => ({
      ...nextUserData,
      contributionAmount,
      stage: contributionAmount === 0 ? 5 : 4,
    }));
  }, [setUserData, selectedContribution, enteredContribution]);

  const toggleButtonStyles = {
    default: "membership-request-contribution__toggle-button",
  };

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">
        {isMonthlyContribution ? "Monthly" : "Personal"} Contribution
      </div>
      <div className="sub-text membership-request-contribution__description">
        Select the amount you would like to contribute <br />
        {isMonthlyContribution ? " each month" : ""} ({formattedMinFeeToJoin}
        {pricePostfix} min.)
      </div>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className="membership-request-contribution__toggle-button-group"
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
              {formatPrice(amount, false)}
              {pricePostfix}
            </ToggleButton>
          ))}
          <ToggleButton styles={toggleButtonStyles} value="other">
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
            allowDecimals={false}
          />
          <ButtonLink
            className="membership-request-contribution__back-to-selection"
            onClick={handleBackToSelectionClick}
          >
            Back to amount selection
          </ButtonLink>
        </div>
      )}
      {isMonthlyContribution && (
        <span className="membership-request-contribution__hint">
          You can cancel the recurring payment at any time
        </span>
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
