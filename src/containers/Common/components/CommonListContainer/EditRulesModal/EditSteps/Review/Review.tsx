import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Button, Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { UpdateGovernanceData } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { RuleList } from "./RuleList";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: (data?: Partial<UpdateGovernanceData>) => void;
  currentData: UpdateGovernanceData;
}

export default function Review({
  currentStep,
  onFinish,
  currentData,
}: ReviewProps): ReactElement {
  const {
    unstructuredRules = [],
  } = currentData;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleContinueClick = () => {
      onFinish();
  };

  const progressEl = (
    <Progress
      creationStep={currentStep}
    />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="update-rules-review">
        {!isMobileView && (
          <Separator className="update-rules-review__separator" />
        )}
        <RuleList rules={unstructuredRules} className="create-common-review__rules" />
        {/* <div className="create-common-review__additional-info-container">
          <div className="create-common-review__additional-info-text">
            To publish the Common, add a personal contribution.{" "}
            <span className="create-common-review__additional-info-text--bold">
              Don’t worry, you will be able to make changes
            </span>{" "}
            to the Common info after it is published.
          </div>
        </div> */}
        <div className="update-rules-review__submit-button-wrapper">
          <Button
            key="rules-continue"
            onClick={handleContinueClick}
            shouldUseFullWidth={isMobileView}
          >
            Update Rules
          </Button>
        </div>
      </div>
    </>
  );
}
