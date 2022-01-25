import React, { useState } from "react";
import { CurrencyInput } from "../../../../shared/components/Form";
import "./index.scss";

interface IProps {
  onContinue: (amount?: number) => void;
}

export default function AmountPrompt({ onContinue }: IProps) {
  const [amount, setAmount] = useState<string | undefined>();

  const handleContinue = () => {
    const value = Number(amount);

    if (value) {
      onContinue(value);
    }
  };

  return (
    <div className="amount-prompt-wrapper">
      <span>Invoice amount</span>
      <CurrencyInput
        name="invoiceAmount"
        value={amount}
        onValueChange={setAmount}
        className="amount-prompt-wrapper__amount-input"
      />
      <button
        disabled={!Number(amount)}
        className="button-blue"
        onClick={handleContinue}
      >
        Done
      </button>
    </div>
  );
}
