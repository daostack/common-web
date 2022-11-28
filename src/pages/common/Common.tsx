import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFullCommonData } from "@/shared/hooks/useCases";
import { Loader } from "@/shared/ui-kit";
import { CommonContent } from "./components";
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
  } = useFullCommonData();
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const isDataFetched = isCommonDataFetched;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchCommonMember(commonId, true);
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  if (!isDataFetched) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    );
  }
  if (!commonData) {
    return null;
  }

  return (
    <CommonContent
      common={commonData.common}
      governance={commonData.governance}
      isCommonMemberFetched={isCommonMemberFetched}
      commonMember={commonMember}
    />
  );
};

export default Common;
