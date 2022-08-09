import React, { FC, useState } from "react";
import { Button } from "@/shared/components";
import { CurrencyInput } from "@/shared/components/Form";
import { formatPrice } from "@/shared/utils";
import { SelectionButton } from "../SelectionButton";
import "./index.scss";

interface PaymentDetailsProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

const AMOUNTS = [18000, 36000, 75000, 120000];

const AmountSelection: FC<PaymentDetailsProps> = (props) => {
  const { amount: currentAmount, onAmountChange } = props;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(() =>
    AMOUNTS.some((amount) => amount === currentAmount) ? currentAmount : null
  );
  const [inputValue, setInputValue] = useState(() =>
    AMOUNTS.some((amount) => amount === currentAmount)
      ? ""
      : String(currentAmount / 100)
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
    onAmountChange(selectedAmount || Number(inputValue) * 100);
  };

  return (
    <div className="dead-sea-amount-selection">
      <h2 className="dead-sea-amount-selection__title">Donation details</h2>
      <div className="dead-sea-amount-selection__amounts-wrapper" role="group">
        {AMOUNTS.map((amount) => (
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
        className="dead-sea-amount-selection__currency-input"
        name="contributionAmount"
        label="Other"
        placeholder="Add amount"
        value={inputValue}
        onValueChange={handleValueChange}
        styles={{
          label: "dead-sea-amount-selection__currency-input-label",
        }}
      />
      <Button
        className="dead-sea-amount-selection__submit-button"
        disabled={!selectedAmount && !Number(inputValue)}
        onClick={handleSubmit}
        shouldUseFullWidth
      >
        Update Contribution
      </Button>
    </div>
  );
};

export default AmountSelection;
