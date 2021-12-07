import React, { useCallback, useState } from "react";
import { ToggleButtonGroup, ToggleButton, ToggleButtonGroupVariant } from "../../../../../shared/components/Form/ToggleButtonGroup";
import { formatPrice } from "../../../../../shared/utils";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";

const MIN_CALCULATION_AMOUNT = 2000;

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [selectedContribution, setSelectedContribution] = useState<number | "other">(userData.contribution_amount || 0);
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin);
  const secondAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 2000 : (minFeeToJoin + 1000);
  const thirdAmount = minFeeToJoin < MIN_CALCULATION_AMOUNT ? 5000 : (minFeeToJoin + 2000);

  const handleChange = useCallback((value: unknown) => {
    const convertedValue = Number(value);
    setSelectedContribution(!Number.isNaN(convertedValue) ? convertedValue : "other");
  }, []);

  const toggleButtonStyles = { default: "membership-request-contribution__toggle-button" };

  return (
    <div className="membership-request-content membership-request-contribution">
      <div className="sub-title">Personal Contribution</div>
      <div className="sub-text">{`Select the amount you would like to contribute (${formattedMinFeeToJoin} min.)`}</div>
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
          {formatPrice(minFeeToJoin)}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value={secondAmount}
        >
          {formatPrice(secondAmount)}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value={thirdAmount}
        >
          {formatPrice(thirdAmount)}
        </ToggleButton>
        <ToggleButton
          styles={toggleButtonStyles}
          value="other"
        >
          Other
        </ToggleButton>
      </ToggleButtonGroup>
      <button
        disabled={!userData.contribution_amount}
        className="button-blue"
        onClick={() => setUserData({ ...userData, stage: 4 })}
      >
        Continue
      </button>
    </div>
  );
}
