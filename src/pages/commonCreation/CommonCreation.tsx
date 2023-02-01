import React, { FC } from "react";
import { useParams } from "react-router-dom";
import { ProjectCreation } from "./components";

interface CommonCreationRouterParams {
  id?: string;
}

const CommonCreation: FC = () => {
  const { id: commonId } = useParams<CommonCreationRouterParams>();

  if (commonId) {
    return <ProjectCreation parentCommonId={commonId} />;
  }

  return null;
};

export default CommonCreation;
