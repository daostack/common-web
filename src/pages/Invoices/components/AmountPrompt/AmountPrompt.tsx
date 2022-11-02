import React, { useState } from "react";
import { CurrencyInput } from "../../../../shared/components/Form";
import "./index.scss";

interface IProps {
  proposalRequest: number;
  totalAmount: number;
  onContinue: (amount?: number) => void;
}

export default function AmountPrompt({
  proposalRequest,
  totalAmount,
  onContinue,
}: IProps) {
  const [amount, setAmount] = useState<string | undefined>();
  const totalAmountExceeded = Number(amount) + totalAmount > proposalRequest;

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
        error={
          totalAmountExceeded
            ? "The total amount is more than proposal request!"
            : ""
        }
        allowDecimals={true}
      />
      <button
        disabled={!Number(amount) || totalAmountExceeded}
        className="button-blue"
        onClick={handleContinue}
      >
        Done
      </button>
    </div>
  );
}
