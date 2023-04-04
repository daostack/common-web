import { useCallback } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";

interface UseGlobalCommonDataArguments {
  commonId: string;
  governanceCircles?: Circles;
}

type State = LoadingState<{
  commonMember: (CommonMember & CirclesPermissions) | null;
}>;

interface Return extends State {
  fetchUserRelatedData: () => void;
}

export const useGlobalCommonData = (
  data: UseGlobalCommonDataArguments,
): Return => {
  const { commonId, governanceCircles } = data;
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
  const isGlobalDataLoading = isCommonMemberLoading;
  const isGlobalDataFetched = isCommonMemberFetched;

  const fetchUserRelatedData = useCallback(() => {
    fetchCommonMember(commonId, {}, true);
  }, [commonId, fetchCommonMember]);

  return {
    loading: isGlobalDataLoading,
    fetched: isGlobalDataFetched,
    data: {
      commonMember,
    },
    fetchUserRelatedData,
  };
};
