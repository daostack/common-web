import React, { useCallback, ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import {
  CommonContributionType,
  CommonLink,
  CommonRule,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils/shared";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import { LinkList } from "./LinkList";
import { MainCommonInfo } from "./MainCommonInfo";
import { RuleList } from "./RuleList";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: () => void;
}

export default function Review({
  currentStep,
  onFinish,
}: ReviewProps): ReactElement {
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonName = "Amazon Network";
  const tagline = "If you wanna save the Amazon, own it.";
  const minFeeToJoin = 1000;
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin, {
    shouldRemovePrefixFromZero: false,
  });
  const contributionType: CommonContributionType =
    CommonContributionType.OneTime;
  const about =
    "We aim to ba a global non-profit initiative. Only small percentage of creative directors are women and we want to help change this through mentorship circles, portfolio reviews, talks & creative meetups.";
  const links: CommonLink[] = [
    { title: "Amazon Facebook group", value: "https://www.google.com" },
    { title: "LinkedIn", value: "https://www.linkedin.com" },
  ];
  const rules: CommonRule[] = [
    {
      title: "No promotions or spam",
      value:
        "We created this community to help you along your journey. Links to sponsored content or brands will vote you out.",
    },
    {
      title: "Be courteous and kind to others",
      value:
        "We're all in this together to create a nurturing environment. Let's teat everyone with respect. Healthy debates are natural, but kindness is required.",
    },
    {
      title: "Be courteous and kind to others",
      value:
        "We're all in this together to create a nurturing environment. Let's teat everyone with respect. Healthy debates are natural, but kindness is required.",
    },
  ];

  const handleContinueClick = useCallback(() => {
    onFinish();
  }, [onFinish]);

  const progressEl = <Progress creationStep={currentStep} />;

  const getMinimumContributionText = (): ReactNode => {
    let text: ReactNode =
      "Members will be able to join the Common without a personal contribution";

    if (minFeeToJoin || contributionType !== CommonContributionType.OneTime) {
      text = (
        <>
          {formattedMinFeeToJoin}{" "}
          <span className="create-common-review__section-description--bold">
            {contributionType === CommonContributionType.OneTime
              ? "one-time"
              : "monthly"}
          </span>{" "}
          contribution
        </>
      );
    }

    return <p className="create-common-review__section-description">{text}</p>;
  };

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-review">
        {isMobileView && progressEl}
        <MainCommonInfo
          className="create-common-review__main-info"
          commonName={commonName}
          tagline={tagline}
          formattedMinFeeToJoin={formattedMinFeeToJoin}
        />
        {!isMobileView && (
          <Separator className="create-common-review__separator" />
        )}
        <div className="create-common-review__section">
          <h5 className="create-common-review__section-title">About</h5>
          <p className="create-common-review__section-description">{about}</p>
        </div>
        <div className="create-common-review__section">
          <h5 className="create-common-review__links-section-title">Links</h5>
          <LinkList links={links} />
        </div>
        <RuleList rules={rules} className="create-common-review__rules" />
        <div className="create-common-review__contribution-container">
          <h5 className="create-common-review__section-title">
            Minimum Contribution
          </h5>
          {getMinimumContributionText()}
        </div>
        <div className="create-common-review__additional-info-container">
          <div className="create-common-review__additional-info-text">
            To publish the Common, add a personal contribution.{" "}
            <span className="create-common-review__additional-info-text--bold">
              Don’t worry, you will be able to make changes
            </span>{" "}
            to the Common info after it is published.
          </div>
        </div>
        <div className="create-common-review__submit-button-wrapper">
          <Button
            key="rules-continue"
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
          >
            Personal Contribution
          </Button>
        </div>
      </div>
    </>
  );
}
