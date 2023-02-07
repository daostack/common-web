import { useCallback } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { useUserPendingJoin } from "./useUserPendingJoin";

interface UseGlobalCommonDataArguments {
  commonId: string;
  parentCommonId?: string;
  governanceCircles?: Circles;
}

type State = LoadingState<{
  commonMember: (CommonMember & CirclesPermissions) | null;
  parentCommonMember: (CommonMember & CirclesPermissions) | null;
  isJoinPending: boolean;
}>;

interface Return extends State {
  fetchUserRelatedData: () => void;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

export const useGlobalCommonData = (
  data: UseGlobalCommonDataArguments,
): Return => {
  const { commonId, parentCommonId, governanceCircles } = data;
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
    fetchCommonMember(commonId, {}, true);
    checkUserPendingJoin(commonId);

    if (parentCommonId) {
      fetchParentCommonMember(parentCommonId, {}, true);
    } else {
      setParentCommonMember(null);
    }
  }, [
    commonId,
    parentCommonId,
    fetchCommonMember,
    checkUserPendingJoin,
    fetchParentCommonMember,
    setParentCommonMember,
  ]);

  return {
    loading: isGlobalDataLoading,
    fetched: isGlobalDataFetched,
    data: {
      commonMember,
      parentCommonMember,
      isJoinPending,
    },
    fetchUserRelatedData,
    setIsJoinPending,
  };
};
