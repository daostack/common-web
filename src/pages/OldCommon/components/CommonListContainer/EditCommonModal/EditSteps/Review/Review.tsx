import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Button, Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { commonTypeText } from "@/shared/utils";
import { UpdateCommonData } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { CommonImageSlider } from "./CommonImageSlider";
import { LinkList } from "./LinkList";
import { MainCommonInfo } from "./MainCommonInfo";
import { RuleList } from "./RuleList";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: (data?: Partial<UpdateCommonData>) => void;
  currentData: UpdateCommonData;
  handleFormValues: (data: Partial<UpdateCommonData>) => void;
  isSubCommonCreation: boolean;
}

export default function Review({
  currentStep,
  onFinish,
  currentData,
  handleFormValues,
  isSubCommonCreation,
}: ReviewProps): ReactElement {
  const {
    name: commonName,
    description: about,
    byline: tagline,
    links = [],
    image,
    //rules = [],
  } = currentData;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleContinueClick = () => {
    onFinish();
  };

  const progressEl = <Progress creationStep={currentStep} />;

  const handleCommonImage = (image: string | File) => {
    handleFormValues({ image });
  };

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="update-common-review">
        {isMobileView && progressEl}
        <CommonImageSlider
          className="update-common-review__image-slider"
          commonName={commonName}
          tagline={tagline}
          initialImage={currentData.image}
          onImageChange={handleCommonImage}
        />
        <MainCommonInfo
          className="update-common-review__main-info"
          commonName={commonName}
          tagline={tagline}
        />
        {!isMobileView && (
          <Separator className="update-common-review__separator" />
        )}
        <div className="update-common-review__section">
          <h5 className="update-common-review__section-title">About</h5>
          <p className="update-common-review__section-description">{about}</p>
        </div>
        <div className="update-common-review__section">
          <h5 className="update-common-review__links-section-title">Links</h5>
          <LinkList links={links} />
        </div>
        {/*<RuleList rules={rules} className="create-common-review__rules" />*/}
        {/* <div className="create-common-review__additional-info-container">
          <div className="create-common-review__additional-info-text">
            To publish the Common, add a personal contribution.{" "}
            <span className="create-common-review__additional-info-text--bold">
              Don’t worry, you will be able to make changes
            </span>{" "}
            to the Common info after it is published.
          </div>
        </div> */}
        <div className="update-common-review__submit-button-wrapper">
          <Button
            key="rules-continue"
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
          >
            Update {commonTypeText(isSubCommonCreation)}
          </Button>
        </div>
      </div>
    </>
  );
}
