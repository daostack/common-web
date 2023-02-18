import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommon } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { CenterWrapper } from "./components";
import { ProjectCreation } from "./components";
import styles from "./CommonCreation.module.scss";

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
    if (!isCommonFetched) {
      return (
        <CenterWrapper>
          <Loader />
        </CenterWrapper>
      );
    }
    if (!common) {
      return (
        <CenterWrapper>
          <p className={styles.dataErrorText}>Common does not exist</p>
        </CenterWrapper>
      );
    }

    return checkIsProject(common) ? (
      <ProjectCreation
        initialCommon={common}
        parentCommonId={common.directParent.commonId}
      />
    ) : null;
  }

  if (commonId) {
    return <ProjectCreation parentCommonId={commonId} />;
  }

  return null;
};

export default CommonCreation;
