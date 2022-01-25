import React, { useState } from "react";
import { CurrencyInput } from "../../../../shared/components/Form";
import "./index.scss";

interface IProps {
  proposalRequest: number;
  totalAmount: number;
  onContinue: (amount?: number) => void;
}

export default function AmountPrompt({ proposalRequest, totalAmount, onContinue }: IProps) {
  const [amount, setAmount] = useState<number | undefined>();
  console.log("proposalRequest " + proposalRequest);
  console.log("totalAmount " + totalAmount);
  return (
    <div className="amount-prompt-wrapper">
      <span>Invoice amount</span>
      <CurrencyInput
        name="invoiceAmount"
        value={amount}
        onValueChange={(value) => setAmount(value ? Number(value) : undefined)}
        className="amount-prompt-wrapper__amount-input"
        max={proposalRequest - totalAmount}
        error="The total is more than proposal request!"
        allowDecimals={true}
      />
      <button disabled={!amount || amount + totalAmount > proposalRequest} className="button-blue" onClick={() => onContinue(amount)}>Done</button>
    </div>
  )
}
