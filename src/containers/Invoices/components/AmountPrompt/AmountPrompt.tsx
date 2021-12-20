import React, { useState } from "react";
import { CurrencyInput } from "../../../../shared/components/Form";
import "./index.scss";

interface IProps {
  onContinue: () => void
}

export default function AmountPrompt({ onContinue }: IProps) {
  const [amount, setAmount] = useState<string | undefined>();

  return (
    <div className="amount-prompt-wrapper">
      <span>Invoice amount</span>
      <CurrencyInput
        name="invoiceAmount"
        value={amount}
        onValueChange={(value) => setAmount(value)}
        className="amount-prompt-wrapper__amount-input"
      />
      <button disabled={!amount} className="button-blue" onClick={() => onContinue()}>Done</button>
    </div>
  )
}