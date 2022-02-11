import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Button, ButtonLink } from "../../../../../shared/components";
import {
  CurrencyInput,
  ToggleButtonGroup,
  ToggleButton,
  ToggleButtonGroupVariant,
} from "../../../../../shared/components/Form";
import { ModalFooter } from "../../../../../shared/components/Modal";
import {
  ScreenSize,
  MIN_CONTRIBUTION_ILS_AMOUNT,
  MAX_CONTRIBUTION_ILS_AMOUNT,
} from "../../../../../shared/constants";
import {
  formatPrice,
  roundNumberToNextTenths,
} from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { getScreenSize } from "../../../../../shared/store/selectors";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

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

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isMonthlyContribution =
    common?.metadata.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;
  const zeroContribution = common?.metadata.zeroContribution || false;

  const amountsForSelection = useMemo(
    () => getAmountsForSelection(minFeeToJoin, zeroContribution),
    [minFeeToJoin, zeroContribution]
  );
  const [selectedContribution, setSelectedContribution] = useState<
    number | "other" | null
  >(() => {
    if (userData.contributionAmount === undefined) {
      return null;
    }

    return amountsForSelection.includes(userData.contributionAmount)
      ? userData.contributionAmount
      : "other";
  });
  const [enteredContribution, setEnteredContribution] = useState<
    string | undefined
  >(() =>
    selectedContribution === "other"
      ? String((userData.contributionAmount || 0) / 100)
      : undefined
  );
  const [isCurrencyInputTouched, setIsCurrencyInputTouched] = useState(false);
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

  const handleCurrencyInputBlur = useCallback(() => {
    setIsCurrencyInputTouched(true);
  }, []);

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(
      !Number.isNaN(convertedValue) ? convertedValue : "other"
    );
  }, []);

  const handleBackToSelectionClick = useCallback(() => {
    setSelectedContribution(null);
    setEnteredContribution(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    const contributionAmount =
      selectedContribution === "other"
        ? Number(enteredContribution) * 100
        : selectedContribution || 0;

    setUserData((nextUserData) => ({
      ...nextUserData,
      contributionAmount,
      stage: contributionAmount === 0 ? 5 : 4,
    }));
  }, [setUserData, selectedContribution, enteredContribution]);

  const toggleButtonStyles = {
    default: "membership-request-contribution__toggle-button",
  };

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">
        {isMonthlyContribution ? "Monthly" : "Personal"} Contribution
      </div>
      <div className="sub-text membership-request-contribution__description">
        Select the amount you would like to contribute <br />
        {isMonthlyContribution ? " each month" : ""} ({formattedMinFeeToJoin}
        {pricePostfix} min.)
      </div>
      {selectedContribution !== "other" && (
        <ToggleButtonGroup
          className={classNames(
            "membership-request-contribution__toggle-button-group",
            {
              "membership-request-contribution__toggle-button-group--one-time": !isMonthlyContribution,
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
        <div className="membership-request-contribution__currency-input-wrapper">
          <CurrencyInput
            name="contributionAmount"
            label="Contribution amount"
            placeholder={formattedMinFeeToJoin}
            value={enteredContribution}
            onValueChange={setEnteredContribution}
            onBlur={handleCurrencyInputBlur}
            error={isCurrencyInputTouched ? currencyInputError : ""}
            styles={{
              label: "membership-request-contribution__currency-input-label",
            }}
            allowDecimals={false}
          />
          <ButtonLink
            className="membership-request-contribution__back-to-selection"
            onClick={handleBackToSelectionClick}
          >
            Back to amount selection
          </ButtonLink>
        </div>
      )}
      {isMonthlyContribution && (
        <span className="membership-request-contribution__hint">
          You can cancel the recurring payment at any time
        </span>
      )}
      <ModalFooter sticky>
        <div className="membership-request-contribution__modal-footer">
          <Button
            className="membership-request-contribution__submit-button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            shouldUseFullWidth={isMobileView}
          >
            Submit
          </Button>
        </div>
      </ModalFooter>
    </div>
  );
}
