import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { Currency } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { commonTypeText } from "@/shared/utils";
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
  isSubCommonCreation: boolean;
  onFinish: (data?: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
  handleFormValues: (data: Partial<IntermediateCreateCommonPayload>) => void;
}

export default function Review({
  currentStep,
  isSubCommonCreation,
  onFinish,
  creationData,
  handleFormValues,
}: ReviewProps): ReactElement {
  const {
    name: commonName,
    description: about,
    byline: tagline,
    links = [],
    rules = [],
    memberAdmittanceOptions,
  } = creationData;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formattedMinFeeToJoin = formatPrice(
    memberAdmittanceOptions?.minFeeMonthly ||
      memberAdmittanceOptions?.minFeeOneTime || {
        amount: 0,
        currency: Currency.ILS,
      },
    {
      shouldRemovePrefixFromZero: false,
      bySubscription: Boolean(memberAdmittanceOptions?.minFeeMonthly),
    },
  );

  const handleContinueClick = () => {
    onFinish();
  };

  const progressEl = (
    <Progress
      creationStep={currentStep}
      isSubCommonCreation={isSubCommonCreation}
    />
  );

  const handleCommonImage = (image: string | File | null) => {
    handleFormValues({ image });
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
          onImageChange={handleCommonImage}
        />
        <MainCommonInfo
          className="create-common-review__main-info"
          commonName={commonName}
          tagline={tagline}
          formattedMinFeeToJoin={formattedMinFeeToJoin}
          isSubCommonCreation={isSubCommonCreation}
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
        {/* <div className="create-common-review__additional-info-container">
          <div className="create-common-review__additional-info-text">
            To publish the Common, add a personal contribution.{" "}
            <span className="create-common-review__additional-info-text--bold">
              Don’t worry, you will be able to make changes
            </span>{" "}
            to the Common info after it is published.
          </div>
        </div> */}
        <div className="create-common-review__submit-button-wrapper">
          <Button
            variant={ButtonVariant.PrimaryPink}
            key="rules-continue"
            onClick={handleContinueClick}
          >
            Create a {commonTypeText(isSubCommonCreation)}
          </Button>
        </div>
      </div>
    </>
  );
}
