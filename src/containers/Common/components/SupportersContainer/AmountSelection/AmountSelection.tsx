import React, { FC, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components";
import {
  CurrencyInput,
  ToggleButtonGroup,
  ToggleButton,
} from "@/shared/components/Form";
import { ContributionType } from "@/shared/constants";
import { emptyFunction, formatPrice } from "@/shared/utils";
import { SelectionButton } from "../SelectionButton";
import { getFinalAmount } from "./helpers";
import "./index.scss";

interface PaymentDetailsProps {
  amount?: number;
  minAmount?: number;
  amountsToSelect: number[];
  preSubmitText?: ReactNode;
  submitButtonText?: string;
  onAmountChange: (amount: number) => void;
  getSubmitLink?: (amount: number) => string;
}

const AmountSelection: FC<PaymentDetailsProps> = (props) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters.amountSelection",
  });
  const {
    amount: currentAmount,
    minAmount,
    amountsToSelect,
    preSubmitText,
    submitButtonText = t("defaultSubmitButtonText"),
    onAmountChange,
    getSubmitLink,
  } = props;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(() =>
    currentAmount && amountsToSelect.some((amount) => amount === currentAmount)
      ? currentAmount
      : null
  );
  const [inputValue, setInputValue] = useState(() =>
    !currentAmount || amountsToSelect.some((amount) => amount === currentAmount)
      ? ""
      : String(currentAmount / 100)
  );
  const inputValueError =
    (typeof minAmount === "number" &&
      inputValue &&
      Number(inputValue) < minAmount / 100 &&
      t("otherInputError", {
        amount: formatPrice(minAmount, { shouldMillify: false }),
      })) ||
    "";
  const submitLink = getSubmitLink
    ? getSubmitLink(getFinalAmount(selectedAmount, inputValue))
    : "";
  const isSubmitDisabled = Boolean(
    (!selectedAmount && !Number(inputValue)) || inputValueError
  );

  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setInputValue("");
  };

  const handleValueChange = (value?: string) => {
    setSelectedAmount(null);
    setInputValue(value || "");
  };

  const handleSubmit = () => {
    onAmountChange(getFinalAmount(selectedAmount, inputValue));
  };

  const submitButtonEl = (
    <Button
      disabled={isSubmitDisabled}
      onClick={submitLink ? emptyFunction : handleSubmit}
      shouldUseFullWidth
    >
      {submitButtonText}
    </Button>
  );

  return (
    <div className="supporters-page-amount-selection">
      <h2 className="supporters-page-amount-selection__title">
        {t("donationDetailsTitle")}
      </h2>
      <ToggleButtonGroup
        className="supporters-page-amount-selection__toggle-button-group"
        value={ContributionType.OneTime}
        onChange={() => {}}
      >
        <ToggleButton value={ContributionType.OneTime}>
          {t("oneTimeTypeText")}
        </ToggleButton>
        <ToggleButton value={ContributionType.Monthly} isDisabled>
          {t("monthlyTypeText")}
        </ToggleButton>
      </ToggleButtonGroup>
      <div
        className="supporters-page-amount-selection__amounts-wrapper"
        role="group"
      >
        {amountsToSelect.map((amount) => (
          <SelectionButton
            key={amount}
            isActive={amount === selectedAmount}
            onClick={() => handleAmountSelection(amount)}
          >
            {formatPrice(amount, { shouldMillify: false })} (ILS)
          </SelectionButton>
        ))}
      </div>
      <CurrencyInput
        className="supporters-page-amount-selection__currency-input"
        name="contributionAmount"
        label={t("otherInputTitle")}
        placeholder={t("otherInputPlaceholder")}
        value={inputValue}
        error={inputValueError}
        onValueChange={handleValueChange}
        styles={{
          label: "supporters-page-amount-selection__currency-input-label",
          error: "supporters-page-amount-selection__currency-input-error",
        }}
      />
      {preSubmitText}
      <div className="supporters-page-amount-selection__submit-button-wrapper">
        {submitLink ? (
          <a href={submitLink} target="_blank" rel="noopener noreferrer">
            {submitButtonEl}
          </a>
        ) : (
          submitButtonEl
        )}
      </div>
    </div>
  );
};

export default AmountSelection;
