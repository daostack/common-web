import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFullCommonData } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import styles from "./Common.module.scss";

interface CommonRouterParams {
  id: string;
}

const Common: FC = () => {
  const { id: commonId } = useParams<CommonRouterParams>();
  const {
    data: commonData,
    fetched: isCommonDataFetched,
    fetchCommonData,
    resetCommonData,
  } = useFullCommonData();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
    resetCommonMember,
  } = useCommonMember();
  const isDataEmpty = commonData === null;
  const isDataFetched = isCommonDataFetched;

  const resetData = () => {
    resetCommonData();
    resetCommonMember();
  };

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchCommonMember(commonId);
  };

  useEffect(() => {
    if (!isDataEmpty) {
      resetData();
    }

    fetchData();
  }, [commonId]);

  if (!isDataFetched) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }

  return <span>Content</span>;
};

export default Common;
