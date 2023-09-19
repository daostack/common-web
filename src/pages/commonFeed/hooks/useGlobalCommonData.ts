import { useCallback, useEffect } from "react";
import { useCommonMember } from "@/pages/OldCommon/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";

interface UseGlobalCommonDataArguments {
  commonId: string;
  rootCommonId?: string;
  parentCommonId?: string;
  governanceCircles?: Circles;
  rootCommonGovernanceCircles?: Circles;
}

type State = LoadingState<{
  commonMember: (CommonMember & CirclesPermissions) | null;
  rootCommonMember: (CommonMember & CirclesPermissions) | null;
  parentCommonMember: (CommonMember & CirclesPermissions) | null;
}>;

interface Return extends State {
  fetchUserRelatedData: () => void;
}

export const useGlobalCommonData = (
  data: UseGlobalCommonDataArguments,
): Return => {
  const {
    commonId,
    rootCommonId,
    parentCommonId,
    governanceCircles,
    rootCommonGovernanceCircles,
  } = data;
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
    loading: isRootCommonMemberLoading,
    fetched: isRootCommonMemberFetched,
    data: rootCommonMember,
    fetchCommonMember: fetchRootCommonMember,
    setCommonMember: setRootCommonMember,
  } = useCommonMember({
    shouldAutoReset: false,
    withSubscription: true,
    commonId: rootCommonId,
    governanceCircles: rootCommonGovernanceCircles,
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
  const isGlobalDataLoading =
    isCommonMemberLoading ||
    isRootCommonMemberLoading ||
    isParentCommonMemberLoading;
  const isGlobalDataFetched =
    isCommonMemberFetched &&
    isRootCommonMemberFetched &&
    isParentCommonMemberFetched;

  const fetchRootCommonMemberData = useCallback(() => {
    if (rootCommonId) {
      fetchRootCommonMember(rootCommonId, {}, true);
    } else {
      setRootCommonMember(null);
    }
  }, [rootCommonId, fetchRootCommonMember, setRootCommonMember]);

  const fetchParentCommonMemberData = useCallback(() => {
    if (parentCommonId && rootCommonId === parentCommonId) {
      return;
    }
    if (parentCommonId) {
      fetchParentCommonMember(parentCommonId, {}, true);
    } else {
      setParentCommonMember(null);
    }
  }, [
    rootCommonId,
    parentCommonId,
    fetchParentCommonMember,
    setParentCommonMember,
  ]);

  const fetchUserRelatedData = useCallback(() => {
    fetchCommonMember(commonId, {}, true);
    fetchRootCommonMemberData();
    fetchParentCommonMemberData();
  }, [
    commonId,
    fetchCommonMember,
    fetchRootCommonMemberData,
    fetchParentCommonMemberData,
  ]);

  useEffect(() => {
    if (rootCommonId === parentCommonId) {
      setParentCommonMember(rootCommonMember);
    }
  }, [rootCommonMember]);

  return {
    loading: isGlobalDataLoading,
    fetched: isGlobalDataFetched,
    data: {
      commonMember,
      rootCommonMember,
      parentCommonMember,
    },
    fetchUserRelatedData,
  };
};
