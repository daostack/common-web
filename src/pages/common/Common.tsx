import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import {
  useFullCommonData,
  useGlobalCommonData,
} from "@/shared/hooks/useCases";
import { Loader, NotFound } from "@/shared/ui-kit";
import { CommonContent, PureCommonTopNavigation } from "./components";
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
    fetched: isGlobalDataFetched,
    fetchUserRelatedData,
    data: { commonMember, parentCommonMember, isJoinPending },
    setIsJoinPending,
  } = useGlobalCommonData({
    commonId,
    parentCommonId: commonData?.common.directParent?.commonId,
    governanceCircles: commonData?.governance.circles,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDataFetched = isCommonDataFetched;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchUserRelatedData();
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  useEffect(() => {
    if (!isCommonDataFetched) {
      return;
    }
    fetchUserRelatedData();
  }, [userId, isCommonDataFetched]);

  if (!isDataFetched) {
    return (
      <div className={styles.centerWrapper}>
        <Loader />
      </div>
    );
  }
  if (!commonData) {
    return (
      <>
        <PureCommonTopNavigation />
        <div className={styles.centerWrapper}>
          <NotFound />
        </div>
      </>
    );
  }

  return (
    <CommonContent
      common={commonData.common}
      parentCommon={commonData.parentCommon}
      governance={commonData.governance}
      parentCommons={commonData.parentCommons}
      subCommons={commonData.subCommons}
      parentCommonSubCommons={commonData.parentCommonSubCommons}
      isGlobalDataFetched={isGlobalDataFetched}
      commonMember={commonMember}
      parentCommonMember={parentCommonMember}
      isJoinPending={isJoinPending}
      setIsJoinPending={setIsJoinPending}
    />
  );
};

export default Common;
