import React, { useCallback, useMemo, useState } from "react";
import { CommonContributionType } from "@/shared/models";
import { formatPrice, roundNumberToNextTenths } from "@/shared/utils";
import {
  CurrencyInput,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupVariant,
} from "@/shared/components/Form";
import classNames from "classnames";
import { ButtonLink, ModalFooter } from "@/shared/components";
import {
  MAX_CONTRIBUTION_ILS_AMOUNT,
  MIN_CONTRIBUTION_ILS_AMOUNT,
  ScreenSize,
} from "@/shared/constants";
import { useSelector } from "react-redux";
import { getScreenSize } from "@/shared/store/selectors";
import { Progress } from "@/containers/Common/components/CommonListContainer/CreateCommonModal/Payment/Progress";
import { IntermediateCreateCommonPayload } from "@/containers/Common/interfaces";
import "./index.scss";

const getAmountsForSelection = (
  minFeeToJoin: number,
  zeroContribution: boolean
): number[] => {
  if (minFeeToJoin === 0 || zeroContribution) {
    return [0, MIN_CONTRIBUTION_ILS_AMOUNT, MIN_CONTRIBUTION_ILS_AMOUNT * 2];
  }

  const minFeeToJoinForUsage = minFeeToJoin / 100;
  const initialAmount = minFeeToJoinForUsage * 2;
  const firstAmount =
    initialAmount % 10 === 0
      ? initialAmount
      : roundNumberToNextTenths(initialAmount);

  return [minFeeToJoinForUsage, firstAmount, firstAmount * 2]
    .map((amount) => amount * 100)
    .filter((amount) => amount <= MAX_CONTRIBUTION_ILS_AMOUNT);
};

const validateContributionAmount = (
  minFeeToJoin: number,
  zeroContribution: boolean,
  value?: string
): string => {
  const minFeeToJoinForUsage = zeroContribution ? 0 : minFeeToJoin;
  const convertedValue = Number(value) * 100;

  if (
    convertedValue >= minFeeToJoinForUsage &&
    (convertedValue === 0 ||
      (convertedValue >= MIN_CONTRIBUTION_ILS_AMOUNT &&
        convertedValue <= MAX_CONTRIBUTION_ILS_AMOUNT))
  ) {
    return "";
  }

  const errorTexts = ["The amount must be"];

  if (minFeeToJoinForUsage === 0) {
    errorTexts.push("0, or");
    errorTexts.push(
      `at least ${formatPrice(MIN_CONTRIBUTION_ILS_AMOUNT, {
        shouldMillify: false,
      })}`
    );
  } else {
    errorTexts.push(
      `at least ${formatPrice(minFeeToJoinForUsage, { shouldMillify: false })}`
    );
  }

  errorTexts.push(
    `and at most ${formatPrice(MAX_CONTRIBUTION_ILS_AMOUNT, {
      shouldMillify: false,
    })}`
  );

  return errorTexts.join(" ");
};

export interface IStageProps {
  selectedAmount: number;
  setSelectedAmount?: (amount: number) => void;
  currentStep: number;
  onFinish: () => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function PersonalContribution(props: IStageProps) {
  const {
    creationData,
    currentStep,
    onFinish,
    selectedAmount,
    setSelectedAmount,
  } = props;
  const isMonthlyContribution =
    creationData.contributionType === CommonContributionType.Monthly;

  /**
   * Backend stores the price in cents, that's why we multiply by 100
   **/

  const minFeeToJoin = creationData.contributionAmount * 100 || 0;
  const zeroContribution = creationData.zeroContribution || false;

  const amountsForSelection = useMemo(
    () => getAmountsForSelection(minFeeToJoin, zeroContribution),
    [minFeeToJoin, zeroContribution]
  );
  const [selectedContribution, setSelectedContribution] = useState<
    number | "other" | null
  >(() => {
    if (selectedAmount === 0) {
      return null;
    }

    return amountsForSelection.includes(selectedAmount)
      ? selectedAmount
      : "other";
  });
  const [enteredContribution, setEnteredContribution] = useState<
    string | undefined
  >(() =>
    selectedContribution === "other"
      ? String((creationData.contributionAmount || 0) / 100)
      : undefined
  );

  const formattedMinFeeToJoin = formatPrice(
    zeroContribution ? 0 : minFeeToJoin,
    { shouldMillify: false, shouldRemovePrefixFromZero: false }
  );
  const pricePostfix = isMonthlyContribution ? "/mo" : "";
  const currencyInputError = validateContributionAmount(
    minFeeToJoin,
    zeroContribution,
    enteredContribution
  );
  const isSubmitDisabled = Boolean(
    selectedContribution === "other"
      ? currencyInputError
      : selectedContribution === null
  );

  const handleSubmit = useCallback(() => {
    const contributionAmount =
      selectedContribution === "other"
        ? Number(enteredContribution) * 100
        : selectedContribution || 0;
    if (setSelectedAmount) {
      setSelectedAmount(contributionAmount);
    }
    onFinish();
  }, [onFinish, setSelectedAmount, selectedContribution, enteredContribution]);

  const progressEl = <Progress creationStep={currentStep} />;
  return (
    <>
      <div className="create-common-content create-common-contribution">
        {progressEl}
        <div className="sub-title">
          {isMonthlyContribution ? "Monthly" : "Personal"} Contribution
        </div>
        <div className="sub-text-wrapper">
          <div className="sub-text__item">
            Select the amount you would like to contribute to this Common.
          </div>
          <div className="sub-text__item">
            Contribution to this Common ({formattedMinFeeToJoin}
            {pricePostfix} min.){" "}
            <span className="sub-text--bold">
              You will not be charged until another member joins{" "}
            </span>{" "}
            the Common.
          </div>
        </div>
        <ContributionAmountSelection selectedContribution={selectedContribution} setSelectedContribution={selectedContribution}/>
        {isMonthlyContribution && (
          <span className="create-common-contribution__hint">
            You can cancel the recurring payment at any time
          </span>
        )}
        <ModalFooter sticky>
          <div className="create-common-contribution__modal-footer">
            <button
              disabled={isSubmitDisabled}
              className="button-blue create-common-contribution__submit-button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </ModalFooter>
      </div>
    </>
  );
}

interface IProps {
  setEnteredContribution: (enteredContribution: string | undefined) => void;
  selectedContribution: number | "other" | null
  setSelectedContribution: (selectedContribution: number | "other" | null) => void;
}

export function ContributionAmountSelection(props: IProps) {
  const {setEnteredContribution, selectedContribution, setSelectedContribution} = props
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
  const handleBackToSelectionClick = useCallback(() => {
    setSelectedContribution(null);
    setEnteredContribution(undefined);
  }, []);
  const handleCurrencyInputBlur = useCallback(() => {
    setIsCurrencyInputTouched(true);
  }, []);

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(
      !Number.isNaN(convertedValue) ? convertedValue : "other"
    );
  }, []);
  const toggleButtonStyles = {
    default: "create-common-contribution__toggle-button",
  };
  return (
    <>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className={classNames(
            "create-common-contribution__toggle-button-group",
            {
              "create-common-contribution__toggle-button-group--one-time": !isMonthlyContribution,
            }
          )}
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
              {formatPrice(amount, {
                shouldMillify: false,
                shouldRemovePrefixFromZero: false,
              })}
              {pricePostfix}
            </ToggleButton>
          ))}
          <ToggleButton styles={toggleButtonStyles} value="other">
            Other
          </ToggleButton>
        </ToggleButtonGroup>
      )}
      {selectedContribution === "other" && (
        <div className="create-common-contribution__currency-input-wrapper">
          <CurrencyInput
            name="contributionAmount"
            label="Contribution amount"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={setEnteredContribution}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "create-common-contribution__currency-input-label",
            }}
            allowDecimals={false}
          />
          <ButtonLink
            className="create-common-contribution__back-to-selection"
            onClick={handleBackToSelectionClick}
          >
            Back to amount selection
          </ButtonLink>
        </div>
      )}
    </>
  );
}
