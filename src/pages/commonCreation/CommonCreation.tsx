import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommon } from "@/shared/hooks/useCases";
import { ProjectCreation } from "./components";

interface CommonCreationRouterParams {
  id?: string;
}

interface CommonCreationProps {
  isEditing?: boolean;
}

const CommonCreation: FC<CommonCreationProps> = (props) => {
  const { isEditing = false } = props;
  const { id: commonId } = useParams<CommonCreationRouterParams>();
  const {
    data: common,
    fetched: isCommonFetched,
    fetchCommon,
    setCommon,
  } = useCommon();

  useEffect(() => {
    if (commonId) {
      fetchCommon(commonId);
    } else {
      setCommon(null);
    }
  }, [commonId]);

  if (isEditing) {
    return null;
  }

  if (commonId) {
    return <ProjectCreation parentCommonId={commonId} />;
  }

  return null;
};

export default CommonCreation;
