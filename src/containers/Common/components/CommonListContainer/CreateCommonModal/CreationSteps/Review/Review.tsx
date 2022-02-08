import React, { useCallback, useState, ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { Button, Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { CommonContributionType } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils/shared";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { CommonImageSlider } from "./CommonImageSlider";
import { LinkList } from "./LinkList";
import { MainCommonInfo } from "./MainCommonInfo";
import { RuleList } from "./RuleList";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function Review({
  currentStep,
  onFinish,
  creationData,
}: ReviewProps): ReactElement {
  const {
    contributionType,
    name: commonName,
    description: about,
    byline: tagline,
    links = [],
    rules = [],
  } = creationData;
  const screenSize = useSelector(getScreenSize());
  const [selectedCommonImage, setSelectedCommonImage] = useState<
    string | File | null
  >(creationData.image);
  const isMobileView = screenSize === ScreenSize.Mobile;
  const minFeeToJoin = creationData.contributionAmount * 100;
  const formattedMinFeeToJoin = formatPrice(minFeeToJoin, {
    shouldRemovePrefixFromZero: false,
  });

  const handleContinueClick = useCallback(() => {
    if (selectedCommonImage) {
      onFinish({ image: selectedCommonImage });
    }
  }, [onFinish, selectedCommonImage]);

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
        <CommonImageSlider
          className="create-common-review__image-slider"
          commonName={commonName}
          tagline={tagline}
          initialImage={creationData.image}
          onImageChange={setSelectedCommonImage}
        />
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
