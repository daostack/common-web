import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "@/pages/Auth/store/selectors";
import { QueryParamKey } from "@/shared/constants";
import { useQueryParams } from "@/shared/hooks";
import {
  useFullCommonData,
  useGlobalCommonData,
} from "@/shared/hooks/useCases";
import { Loader, NotFound, PureCommonTopNavigation } from "@/shared/ui-kit";
import {
  setCommonGovernance,
  setCommonMember,
} from "@/store/states/common/actions";
import { CommonContent } from "./components";
import styles from "./Common.module.scss";

interface CommonRouterParams {
  id: string;
}

const Common: FC = () => {
  const { id: commonId } = useParams<CommonRouterParams>();
  const queryParams = useQueryParams();
  const dispatch = useDispatch();
  const {
    data: commonData,
    fetched: isCommonDataFetched,
    fetchCommonData,
  } = useFullCommonData();
  const parentCommonId = commonData?.common.directParent?.commonId;
  const parentCircleId = commonData?.common.directParent?.circleId;
  const {
    fetched: isGlobalDataFetched,
    fetchUserRelatedData,
    fetchParentCommonMemberData,
    data: { commonMember, parentCommonMember, isJoinPending },
    setIsJoinPending,
  } = useGlobalCommonData({
    commonId,
    parentCommonId,
    parentCircleId,
    governanceCircles: commonData?.governance.circles,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const tabQueryParam = queryParams[QueryParamKey.Tab];
  const isDataFetched = isCommonDataFetched;

  const fetchData = () => {
    fetchCommonData(commonId);
    fetchUserRelatedData();
  };

  useEffect(() => {
    fetchData();
  }, [commonId]);

  useEffect(() => {
    fetchUserRelatedData();
  }, [userId]);

  useEffect(() => {
    dispatch(setCommonMember(commonMember || null));
  }, [dispatch, commonMember]);

  useEffect(() => {
    dispatch(setCommonGovernance(commonData?.governance || null));
  }, [dispatch, commonData?.governance]);

  useEffect(() => {
    if (isCommonDataFetched) {
      fetchParentCommonMemberData();
    }
  }, [userId, parentCommonId, parentCircleId, isCommonDataFetched]);

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
      defaultTab={typeof tabQueryParam === "string" ? tabQueryParam : ""}
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
