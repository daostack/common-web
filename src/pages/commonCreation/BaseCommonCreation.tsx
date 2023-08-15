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
}

const BaseCommonCreation: FC<CommonCreationPageProps> = (props) => {
  const { initialCommon } = props;
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

  return <Creation />;
};

export default BaseCommonCreation;
