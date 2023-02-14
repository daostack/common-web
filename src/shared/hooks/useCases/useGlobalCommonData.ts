import { useCallback } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { useUserPendingJoin } from "./useUserPendingJoin";

interface UseGlobalCommonDataArguments {
  commonId: string;
  parentCommonId?: string;
  parentCircleId?: string;
  governanceCircles?: Circles;
}

type State = LoadingState<{
  commonMember: (CommonMember & CirclesPermissions) | null;
  parentCommonMember: (CommonMember & CirclesPermissions) | null;
  isJoinPending: boolean;
}>;

interface Return extends State {
  fetchUserRelatedData: () => void;
  fetchParentCommonMemberData: () => void;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

export const useGlobalCommonData = (
  data: UseGlobalCommonDataArguments,
): Return => {
  const { commonId, parentCommonId, parentCircleId, governanceCircles } = data;
  const {
    loading: isCommonMemberLoading,
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    commonId,
    governanceCircles,
  });
  const {
    loading: isParentCommonMemberLoading,
    fetched: isParentCommonMemberFetched,
    data: parentCommonMember,
    fetchCommonMember: fetchParentCommonMember,
    setCommonMember: setParentCommonMember,
    resetCommonMember: resetParentCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
  });
  const {
    loading: isPendingJoinCheckLoading,
    fetched: isPendingJoinCheckFinished,
    data: isJoinPending,
    checkUserPendingJoin,
    setIsJoinPending,
  } = useUserPendingJoin();
  const isGlobalDataLoading =
    isCommonMemberLoading ||
    isPendingJoinCheckLoading ||
    isParentCommonMemberLoading;
  const isGlobalDataFetched =
    isCommonMemberFetched &&
    isPendingJoinCheckFinished &&
    isParentCommonMemberFetched;

  const fetchUserRelatedData = useCallback(() => {
    resetParentCommonMember();
    fetchCommonMember(commonId, {}, true);
    checkUserPendingJoin(commonId, {
      parentCommonId,
      parentCircleId,
    });
  }, [
    commonId,
    parentCommonId,
    parentCircleId,
    fetchCommonMember,
    checkUserPendingJoin,
    resetParentCommonMember,
  ]);

  const fetchParentCommonMemberData = useCallback(() => {
    if (parentCommonId) {
      fetchParentCommonMember(parentCommonId, {}, true);
    } else {
      setParentCommonMember(null);
    }
  }, [parentCommonId, fetchParentCommonMember, setParentCommonMember]);

  return {
    loading: isGlobalDataLoading,
    fetched: isGlobalDataFetched,
    data: {
      commonMember,
      parentCommonMember,
      isJoinPending,
    },
    fetchUserRelatedData,
    fetchParentCommonMemberData,
    setIsJoinPending,
  };
};
