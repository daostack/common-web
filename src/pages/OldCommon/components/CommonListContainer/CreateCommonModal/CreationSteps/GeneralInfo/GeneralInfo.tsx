import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { parseLinksForSubmission } from "@/shared/utils";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { CircleSelection } from "./CircleSelection";
import { MainInfo } from "./MainInfo";
import { MainInfoValues } from "./types";
import "./index.scss";

interface GeneralInfoProps {
  currentStep: number;
  isSubCommonCreation: boolean;
  governance?: Governance;
  subCommons: Common[];
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function GeneralInfo(props: GeneralInfoProps): ReactElement {
  const {
    currentStep,
    isSubCommonCreation,
    governance,
    subCommons,
    onFinish,
    creationData,
  } = props;
  const [circleIdFromParent, setCircleIdFromParent] = useState<
    string | undefined
  >(creationData.circleIdFromParent);
  const [shouldShowMainInfo, setShouldShowMainInfo] = useState(
    !isSubCommonCreation,
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleCircleSelection = (circleId: string) => {
    setCircleIdFromParent(circleId);
    setShouldShowMainInfo(true);
  };

  const handleMainInfoSubmit = (values: MainInfoValues) => {
    const links = parseLinksForSubmission(values.links);

    onFinish({
      name: values.commonName,
      byline: values.tagline,
      description: values.about,
      links,
      circleIdFromParent,
    });
  };

  const progressEl = (
    <Progress
      creationStep={currentStep}
      isSubCommonCreation={isSubCommonCreation}
    />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-general-info">
        {isMobileView && progressEl}
        <Separator className="create-common-general-info__separator" />
        {shouldShowMainInfo && (
          <MainInfo
            onFinish={handleMainInfoSubmit}
            creationData={creationData}
            isSubCommonCreation={isSubCommonCreation}
          />
        )}
        {!shouldShowMainInfo && governance && (
          <CircleSelection
            onFinish={handleCircleSelection}
            creationData={creationData}
            governance={governance}
            subCommons={subCommons}
          />
        )}
      </div>
    </>
  );
}
