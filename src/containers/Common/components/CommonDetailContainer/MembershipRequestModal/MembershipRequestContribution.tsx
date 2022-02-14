import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Button, ContributionAmountSelection } from "@/shared/components";
import { ModalFooter } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { CommonContributionType } from "@/shared/models";
import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import "./index.scss";

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const [
    [selectedContribution, hasSelectedContributionError],
    setSelectedContributionState,
  ] = useState<[number | null, boolean]>([
    userData.contributionAmount ?? null,
    !userData.contributionAmount,
  ]);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isMonthlyContribution =
    common?.metadata.contributionType === CommonContributionType.Monthly;
  const minFeeToJoin = common?.metadata.minFeeToJoin || 0;
  const zeroContribution = common?.metadata.zeroContribution || false;

  const formattedMinFeeToJoin = formatPrice(
    zeroContribution ? 0 : minFeeToJoin,
    { shouldMillify: false, shouldRemovePrefixFromZero: false }
  );
  const pricePostfix = isMonthlyContribution ? "/mo" : "";
  const isSubmitDisabled =
    hasSelectedContributionError || selectedContribution === null;

  const handleChange = useCallback(
    (amount: number | null, hasError: boolean) => {
      setSelectedContributionState([amount, hasError]);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (hasSelectedContributionError || selectedContribution === null) {
      return;
    }

    setUserData((nextUserData) => ({
      ...nextUserData,
      contributionAmount: selectedContribution,
      stage: selectedContribution === 0 ? 5 : 4,
    }));
  }, [setUserData, selectedContribution, hasSelectedContributionError]);

  const contributionAmountSelectionClassName = classNames(
    "membership-request-contribution__contribution-amount-selection",
    {
      "membership-request-contribution__contribution-amount-selection--one-time": !isMonthlyContribution,
    }
  );

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
      <ContributionAmountSelection
        className={contributionAmountSelectionClassName}
        contributionAmount={userData.contributionAmount}
        minFeeToJoin={minFeeToJoin}
        zeroContribution={zeroContribution}
        pricePostfix={pricePostfix}
        onChange={handleChange}
      />
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
