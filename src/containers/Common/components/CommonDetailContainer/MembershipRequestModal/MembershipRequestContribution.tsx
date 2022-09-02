import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { Button, ContributionAmountSelection } from "@/shared/components";
import { ModalFooter } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";
import "./index.scss";

export default function MembershipRequestContribution(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const contributionAmount = 5000;
  const [
    [selectedContribution, hasSelectedContributionError],
    setSelectedContributionState,
  ] = useState<[number | null, boolean]>([
    contributionAmount ?? null,
    !contributionAmount,
  ]);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const isMonthlyContribution = false;
  const minFeeToJoin = 0;
  const zeroContribution = false;

  const formattedMinFeeToJoin = formatPrice(
    zeroContribution ? 0 : minFeeToJoin,
    {
      shouldMillify: false,
      shouldRemovePrefixFromZero: false,
      bySubscription: isMonthlyContribution,
    }
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
      stage:
        selectedContribution === 0
          ? MembershipRequestStage.Creating
          : MembershipRequestStage.Payment,
    }));
  }, [setUserData, selectedContribution, hasSelectedContributionError]);

  const contributionAmountSelectionClassName = classNames(
    "membership-request-contribution__contribution-amount-selection",
    {
      "membership-request-contribution__contribution-amount-selection--one-time":
        !isMonthlyContribution,
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
        min.)
      </div>
      <ContributionAmountSelection
        className={contributionAmountSelectionClassName}
        minimalAmount={minFeeToJoin}
        contributionAmount={contributionAmount}
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
