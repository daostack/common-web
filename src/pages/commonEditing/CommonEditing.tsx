import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommon } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { checkIsProject } from "@/shared/utils";
import { CommonCreationPage, CenterWrapper } from "../commonCreation";
import { Editing } from "./components";
import styles from "./CommonEditing.module.scss";

interface CommonEditingRouterParams {
  id: string;
}

const CommonEditing = () => {
  const { id: commonId } = useParams<CommonEditingRouterParams>();
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
    <CommonCreationPage initialCommon={common} />
  ) : (
    <Editing common={common} />
  );
};

export default CommonEditing;
