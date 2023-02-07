import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFullCommonData } from "@/shared/hooks/useCases";
import { useGlobalCommonData } from "@/shared/hooks/useCases/useGlobalCommonData";
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
    fetchGlobalCommonData,
    data: { parentCommonMember, commonMember, isJoinPending },
    setIsJoinPending,
  } = useGlobalCommonData();
  const isDataFetched = isCommonDataFetched;
  const governanceCircles = commonData?.governance.circles;

  const fetchData = () => {
    fetchCommonData(commonId);
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  useEffect(() => {
    if (!commonId) {
      return;
    }

    fetchGlobalCommonData({
      commonId,
      parentCommonId: commonData?.parentCommon?.id,
      governanceCircles: commonData?.governance.circles,
    });
  }, [commonId, commonData?.parentCommon?.id, governanceCircles]);

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
