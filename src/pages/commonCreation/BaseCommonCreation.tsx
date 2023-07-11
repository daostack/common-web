import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { Common } from "@/shared/models";
import { checkIsProject } from "@/shared/utils";
import { ProjectCreation } from "./components";

interface CommonCreationRouterParams {
  id?: string;
}

export interface CommonCreationProps {
  initialCommon?: Common;
}

const BaseCommonCreation: FC<CommonCreationProps> = (props) => {
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

  return null;
};

export default BaseCommonCreation;
