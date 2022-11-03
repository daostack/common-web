import React, { FC, ReactNode, useMemo, useState } from "react";
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
  contributionType?: ContributionType;
  minOneTimeAmount: number;
  minMonthlyAmount: number;
  oneTimeAmountsToSelect: number[];
  monthlyAmountToSelect: number[];
  preSubmitText?: ReactNode;
  submitButtonText?: string;
  onAmountChange: (amount: number, contributionType: ContributionType) => void;
  getSubmitLink?: (amount: number) => string;
}

const AmountSelection: FC<PaymentDetailsProps> = (props) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters.amountSelection",
  });
  const {
    amount: currentAmount,
    contributionType,
    minOneTimeAmount,
    minMonthlyAmount,
    monthlyAmountToSelect,
    oneTimeAmountsToSelect,
    preSubmitText,
    submitButtonText = t("defaultSubmitButtonText"),
    onAmountChange,
    getSubmitLink,
  } = props;
  const [tabValue, setTabValue] = useState(
    contributionType || ContributionType.OneTime,
  );
  const oneTimeSelectionData = useMemo(
    () => ({
      minAmount:
        contributionType === ContributionType.Monthly
          ? minMonthlyAmount
          : minOneTimeAmount,
      amountsToSelect:
        contributionType === ContributionType.Monthly
          ? monthlyAmountToSelect
          : oneTimeAmountsToSelect,
      isMonthlyContribution: contributionType === ContributionType.Monthly,
    }),
    [minOneTimeAmount, oneTimeAmountsToSelect],
  );

  const monthlySelectionData = useMemo(
    () => ({
      minAmount: minMonthlyAmount,
      amountsToSelect: monthlyAmountToSelect,
      isMonthlyContribution: true,
    }),
    [minOneTimeAmount, oneTimeAmountsToSelect],
  );
  const [selectionData, setSelectionData] = useState(
    () => oneTimeSelectionData,
  );
  const [selectedAmount, setSelectedAmount] = useState<number | null>(() =>
    currentAmount &&
    selectionData.amountsToSelect.some((amount) => amount === currentAmount)
      ? currentAmount
      : null,
  );
  const [inputValue, setInputValue] = useState(() =>
    !currentAmount ||
    selectionData.amountsToSelect.some((amount) => amount === currentAmount)
      ? ""
      : String(currentAmount / 100),
  );
  const inputValueError =
    (typeof selectionData.minAmount === "number" &&
      inputValue &&
      Number(inputValue) < selectionData.minAmount / 100 &&
      t("otherInputError", {
        amount: formatPrice(selectionData.minAmount, {
          shouldMillify: false,
          bySubscription: selectionData.isMonthlyContribution,
        }),
      })) ||
    "";
  const submitLink = getSubmitLink
    ? getSubmitLink(getFinalAmount(selectedAmount, inputValue))
    : "";
  const isSubmitDisabled = Boolean(
    (!selectedAmount && !Number(inputValue)) || inputValueError,
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
    onAmountChange(
      getFinalAmount(selectedAmount, inputValue),
      selectionData.isMonthlyContribution
        ? ContributionType.Monthly
        : ContributionType.OneTime,
    );
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
        value={tabValue}
        onChange={(value) => {
          setTabValue(value as ContributionType);
          setSelectionData(
            value === ContributionType.Monthly
              ? monthlySelectionData
              : oneTimeSelectionData,
          );
        }}
      >
        <ToggleButton value={ContributionType.OneTime}>
          {t("oneTimeTypeText")}
        </ToggleButton>
        <ToggleButton
          value={ContributionType.Monthly}
          tooltip={t("monthlyTypeTooltip")}
        >
          {t("monthlyTypeText")}
        </ToggleButton>
      </ToggleButtonGroup>
      <div
        className="supporters-page-amount-selection__amounts-wrapper"
        role="group"
      >
        {selectionData.amountsToSelect.map((amount) => (
          <SelectionButton
            key={amount}
            isActive={amount === selectedAmount}
            onClick={() => handleAmountSelection(amount)}
          >
            {formatPrice(amount, {
              shouldMillify: false,
              bySubscription: selectionData.isMonthlyContribution,
            })}
          </SelectionButton>
        ))}
      </div>
      <CurrencyInput
        className="supporters-page-amount-selection__currency-input"
        name="contributionAmount"
        label={t("otherInputTitle")}
        hint={
          selectionData.isMonthlyContribution
            ? t("otherInputMonthlyHint")
            : undefined
        }
        placeholder={t("otherInputPlaceholder")}
        value={inputValue}
        error={inputValueError}
        onValueChange={handleValueChange}
        styles={{
          label: "supporters-page-amount-selection__currency-input-label",
          error: "supporters-page-amount-selection__currency-input-error",
          hint: "supporters-page-amount-selection__currency-input-hint",
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
