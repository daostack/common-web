import React, { FC, ReactNode, useState } from "react";
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
  amountsToSelect: number[];
  preSubmitText?: ReactNode;
  submitButtonText?: string;
  onAmountChange: (amount: number) => void;
  getSubmitLink?: (amount: number) => string;
}

const AmountSelection: FC<PaymentDetailsProps> = (props) => {
  const {
    amount: currentAmount,
    amountsToSelect,
    preSubmitText,
    submitButtonText = "Update Contribution",
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
  const submitLink = getSubmitLink
    ? getSubmitLink(getFinalAmount(selectedAmount, inputValue))
    : "";
  const isSubmitDisabled = !selectedAmount && !Number(inputValue);

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
        Donation details
      </h2>
      <ToggleButtonGroup
        className="supporters-page-amount-selection__toggle-button-group"
        value={ContributionType.OneTime}
        onChange={() => {}}
      >
        <ToggleButton value={ContributionType.OneTime}>One time</ToggleButton>
        <ToggleButton value={ContributionType.Monthly} isDisabled>
          Monthly
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
        label="Other"
        placeholder="Add amount"
        value={inputValue}
        onValueChange={handleValueChange}
        styles={{
          label: "supporters-page-amount-selection__currency-input-label",
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
