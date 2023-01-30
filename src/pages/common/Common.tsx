import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { useFullCommonData, useUserPendingJoin } from "@/shared/hooks/useCases";
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
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    commonId,
    governanceCircles: commonData?.governance.circles,
  });
  const {
    fetched: isPendingJoinCheckFinished,
    data: isJoinPending,
    checkUserPendingJoin,
    setIsJoinPending,
  } = useUserPendingJoin();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDataFetched = isCommonDataFetched;
  const isGlobalDataFetched =
    isCommonMemberFetched && isPendingJoinCheckFinished;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchCommonMember(commonId, {}, true);
    checkUserPendingJoin(commonId);
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  useEffect(() => {
    fetchCommonMember(commonId, {}, true);
    checkUserPendingJoin(commonId);
  }, [userId]);

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
      isCommonMemberFetched={isCommonMemberFetched}
      isJoinPending={isJoinPending}
      setIsJoinPending={setIsJoinPending}
    />
  );
};

export default Common;
