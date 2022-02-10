import React, { useCallback, useMemo, useState } from "react";
import { CommonContributionType } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import {Button, ModalFooter} from '@/shared/components';
import { Progress } from "../Progress";
import { IntermediateCreateCommonPayload } from "@/containers/Common/interfaces";
import { ContributionAmountSelection } from "@/shared/components/ContributionAmountSelection";
import {
  getAmountsForSelection,
  validateContributionAmount,
} from "../helpers/helpers";
import {useSelector} from 'react-redux';
import {getScreenSize} from '@/shared/store/selectors';
import {ScreenSize} from '@/shared/constants';
import "./index.scss";

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
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
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
    <div className="create-common-contribution">
      {progressEl}
      <div className="create-common-contribution__sub-title">
        {isMonthlyContribution ? "Monthly" : "Personal"} Contribution
      </div>
      <div className="create-common-contribution__sub-text-wrapper">
        <div className="create-common-contribution__sub-text-item">
          Select the amount you would like to contribute to this Common.
        </div>
        <div className="create-common-contribution__sub-text-item">
          Contribution to this Common ({formattedMinFeeToJoin}
          {pricePostfix} min.){" "}
          <span className="create-common-contribution__sub-text-item--bold">
            You will not be charged until another member joins{" "}
          </span>{" "}
          the Common.
        </div>
      </div>
      <ContributionAmountSelection
        selectedContribution={selectedContribution}
        setSelectedContribution={setSelectedContribution}
        enteredContribution={enteredContribution}
        setEnteredContribution={setEnteredContribution}
        amountsForSelection={amountsForSelection}
        isMonthlyContribution={isMonthlyContribution}
        pricePostfix={pricePostfix}
        currencyInputError={currencyInputError}
        formattedMinFeeToJoin={formattedMinFeeToJoin}
      />
      {isMonthlyContribution && (
        <span className="create-common-contribution__hint">
          You can cancel the recurring payment at any time
        </span>
      )}
      <ModalFooter sticky>
          <div className="create-common-contribution__submit-button">
            <Button
                key="personal-contribution-continue"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
                shouldUseFullWidth={isMobileView}
            >
              Submit
            </Button>
          </div>
      </ModalFooter>
    </div>
  );
}
