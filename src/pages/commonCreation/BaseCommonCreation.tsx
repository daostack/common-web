import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Common } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";
import { ProjectCreation, CommonCreation as Creation } from "./components";

interface CommonCreationRouterParams {
  id?: string;
}

export interface CommonCreationPageProps {
  initialCommon?: Common;
  isCommonCreation?: boolean;
}

const BaseCommonCreation: FC<CommonCreationPageProps> = (props) => {
  const { initialCommon, isCommonCreation } = props;
  const { id: commonId } = useParams<CommonCreationRouterParams>();

  if (initialCommon) {
    return checkIsProject(initialCommon) ? (
      <ProjectCreation
        initialCommon={initialCommon}
        parentCommonId={initialCommon.directParent.commonId}
      />
    ) : null;
  }

  if (commonId) {
    return <ProjectCreation parentCommonId={commonId} />;
  }

  if (isCommonCreation) {
    return <Creation></Creation>;
  }

  return null;
};

export default BaseCommonCreation;
