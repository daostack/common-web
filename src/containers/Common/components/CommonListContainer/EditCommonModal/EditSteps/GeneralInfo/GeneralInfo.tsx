import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { Common, Governance } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { parseLinksForSubmission } from "@/shared/utils";
import { UpdateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { CircleSelection } from "./CircleSelection";
import { MainInfo } from "./MainInfo";
import { MainInfoValues } from "./types";
import "./index.scss";

interface GeneralInfoProps {
  currentStep: number;
  governance?: Governance;
  onFinish: (data: Partial<UpdateCommonPayload>) => void;
  currentData: UpdateCommonPayload;
}

export default function GeneralInfo(props: GeneralInfoProps): ReactElement {
  const {
    currentStep,
    governance,
    onFinish,
    currentData,
  } = props;
  const [shouldShowMainInfo, setShouldShowMainInfo] = useState(
    true
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleCircleSelection = (circleId: string) => {
    setShouldShowMainInfo(true);
  };

  const handleMainInfoSubmit = (values: MainInfoValues) => {
    const links = parseLinksForSubmission(values.links);

    onFinish({
      name: values.commonName,
      byline: values.tagline,
      description: values.about,
      links,
    });
  };

  const progressEl = (
    <Progress
      creationStep={currentStep}
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
            currentData={currentData}
          />
        )}
      </div>
    </>
  );
}
