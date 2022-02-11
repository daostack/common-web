import {
  MAX_CONTRIBUTION_ILS_AMOUNT,
  MIN_CONTRIBUTION_ILS_AMOUNT,
} from "../../constants";
import { formatPrice, roundNumberToNextTenths } from "../../utils";

export const getAmountsForSelection = (
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

export const validateContributionAmount = (
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

export const getInitialSelectedContributionValue = (
  amountsForSelection: number[],
  contributionAmount?: number
): number | "other" | null => {
  if (contributionAmount === undefined) {
    return null;
  }

  return amountsForSelection.includes(contributionAmount)
    ? contributionAmount
    : "other";
};

export const getInitialEnteredContributionValue = (
  selectedContribution: number | "other" | null,
  contributionAmount?: number
): string | undefined =>
  selectedContribution === "other" && contributionAmount
    ? String(contributionAmount / 100)
    : undefined;
