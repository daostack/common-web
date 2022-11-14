import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Button, Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { UpdateGovernanceRulesData } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { RuleList } from "./RuleList";
import "./index.scss";

interface ReviewProps {
  currentStep: number;
  onFinish: (data?: Partial<UpdateGovernanceRulesData>) => void;
  currentData: UpdateGovernanceRulesData;
  isSubCommon: boolean;
}

export default function Review({
  currentStep,
  onFinish,
  currentData,
  isSubCommon,
}: ReviewProps): ReactElement {
  const { allRules } = currentData;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleContinueClick = () => {
    onFinish();
  };

  const progressEl = (
    <Progress creationStep={currentStep} isSubCommon={isSubCommon} />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="update-rules-review">
        {!isMobileView && (
          <Separator className="update-rules-review__separator" />
        )}
        <RuleList rules={allRules} className="create-common-review__rules" />
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
