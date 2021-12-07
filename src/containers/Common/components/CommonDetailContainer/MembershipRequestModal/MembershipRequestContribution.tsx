import React, { useCallback, useState } from "react";
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupVariant } from "../../../../../shared/components/Form/ToggleButtonGroup";
import { ModalFooter } from "../../../../../shared/components/Modal";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

const MIN_CALCULATION_AMOUNT = 2000;

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [selectedContribution, setSelectedContribution] = useState<number | "other">(userData.contribution_amount || 0);
  const isMonthlyContribution = common?.metadata.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin);
  const secondAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 2000 : (minFeeToJoin + 1000);
  const thirdAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 5000 : (minFeeToJoin + 2000);
  const pricePostfix = isMonthlyContribution ? "/mo" : "";

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(!Number.isNaN(convertedValue) ? convertedValue : "other");
  }, []);

  const toggleButtonStyles = { default: "membership-request-contribution__toggle-button" };

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">{isMonthlyContribution ? "Monthly" : "Personal"} Contribution</div>
      <div className="sub-text membership-request-contribution__description">
        Select the amount you would like to contribute{isMonthlyContribution ? " each month" : ""} ({formattedMinFeeToJoin}{pricePostfix} min.)
      </div>
      <ToggleButtonGroup
        className="membership-request-contribution__toggle-button-group"
        value={selectedContribution}
        onChange={handleChange}
        variant={ToggleButtonGroupVariant.Vertical}
      >
        <ToggleButton
          styles={toggleButtonStyles}
          value={minFeeToJoin}
        >
          {formatPrice(minFeeToJoin)}{pricePostfix}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value={secondAmount}
        >
          {formatPrice(secondAmount)}{pricePostfix}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value={thirdAmount}
        >
          {formatPrice(thirdAmount)}{pricePostfix}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value="other"
        >
          Other
        </ToggleButton>
      </ToggleButtonGroup>
      {isMonthlyContribution && (
        <span className="membership-request-contribution__hint">You can cancel the recurring payment at any time</span>
      )}
      <ModalFooter sticky>
        <div className="membership-request-contribution__modal-footer">
          <button
            disabled={!userData.contribution_amount}
            className="button-blue"
            onClick={() => setUserData({ ...userData, stage: 4 })}
          >
            Submit
          </button>
        </div>
      </ModalFooter>
    </div>
  );
}
