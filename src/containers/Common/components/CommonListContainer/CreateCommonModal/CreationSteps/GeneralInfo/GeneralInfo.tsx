import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Separator } from "@/shared/components";
import { ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { MainInfo } from "./MainInfo";
import { MainInfoValues } from "./types";
import "./index.scss";

interface GeneralInfoProps {
  currentStep: number;
  isSubCommonCreation: boolean;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

export default function GeneralInfo(props: GeneralInfoProps): ReactElement {
  const { currentStep, isSubCommonCreation, onFinish, creationData } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleMainInfoSubmit = (values: MainInfoValues) => {
    const links = values.links.filter((link) => link.title && link.value);

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
      isSubCommonCreation={isSubCommonCreation}
    />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-general-info">
        {isMobileView && progressEl}
        <Separator className="create-common-general-info__separator" />
        <MainInfo onFinish={handleMainInfoSubmit} creationData={creationData} />
      </div>
    </>
  );
}
