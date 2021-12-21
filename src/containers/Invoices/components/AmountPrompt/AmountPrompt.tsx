import React, { useState } from "react";
import { CurrencyInput } from "../../../../shared/components/Form";
import "./index.scss";

interface IProps {
  onContinue: (amount: number | undefined) => void
}

export default function AmountPrompt({ onContinue }: IProps) {
  const [amount, setAmount] = useState<number | undefined>();

  return (
    <div className="amount-prompt-wrapper">
      <span>Invoice amount</span>
      <CurrencyInput
        name="invoiceAmount"
        value={amount}
        onValueChange={(value) => setAmount(Number(value))}
        className="amount-prompt-wrapper__amount-input"
      />
      <button disabled={!amount} className="button-blue" onClick={() => onContinue(amount)}>Done</button>
    </div>
  )
}