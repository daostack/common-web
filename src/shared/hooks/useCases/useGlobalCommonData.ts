import { useCallback, useState } from "react";
import { Circles, CirclesPermissions, CommonMember } from "@/shared/models";
import { LoadingState } from "@/shared/interfaces";
import { generateCirclesDataForCommonMember } from "@/shared/utils";
import { CommonService, ProposalService } from "@/services";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";

type State = LoadingState<{
  parentCommonMember: CommonMember | null;
  commonMember: CommonMember & CirclesPermissions | null;
  isJoinPending: boolean;
}>;

const DEFAULT_STATE = {
  parentCommonMember: null,
  commonMember: null,
  isJoinPending: false,
}


interface FetchGlobalCommonData {
  commonId: string;
  parentCommonId?: string;
  governanceCircles?: Circles;
}

interface Return extends State {
  setIsJoinPending: (isJoinPending: boolean) => void;
  fetchGlobalCommonData: (data: FetchGlobalCommonData) => void;
  resetGlobalCommonData: () => void;
}

export const useGlobalCommonData = (): Return => {
  const [state, setState] = useState<State>({
    loading: false,
    fetched: false,
    data: DEFAULT_STATE,
  });
  const user = useSelector(selectUser());
  const userId = user?.uid;

  const fetchGlobalCommonData = useCallback(async ({commonId: id, parentCommonId: parentId, governanceCircles: circles}:FetchGlobalCommonData) => {
    if (state.loading || state.fetched) {
      return;
    }
    if (!userId) {
      setState({
        loading: false,
        fetched: true,
        data: DEFAULT_STATE,
      });
      return;
    }
    setState({
      loading: true,
      fetched: false,
      data: DEFAULT_STATE,
    });

    try {
      const [commonMember, isJoinPending] = await Promise.all([
        CommonService.getCommonMemberByUserId(id, userId),
        ProposalService.checkHasUserPendingMemberAdmittanceProposal(id, userId)
      ]);
      const parentCommonMember = await (parentId ? CommonService.getCommonMemberByUserId(parentId, userId) : null);
      const commonMemberWithCircles = commonMember && circles ? {
        ...commonMember,
        ...generateCirclesDataForCommonMember(
          circles,
          commonMember.circleIds,
        ),
      } : null;
        setState({
          loading: false,
          fetched: true,
          data: {
            commonMember: commonMemberWithCircles,
            parentCommonMember,
            isJoinPending
          },
        });
    } catch(err) {
      setState({
        loading: false,
        fetched: true,
        data: DEFAULT_STATE,
      });
    }
  },[])

  const setIsJoinPending = (isJoinPending: boolean): void => {
    setState({
      loading: false,
      fetched: true,
      data: {
        commonMember: state.data?.commonMember ?? null,
        parentCommonMember: state.data?.parentCommonMember ?? null,
        isJoinPending
      },
    });
  }

  const resetGlobalCommonData = useCallback(() => {
    setState({
      loading: false,
      fetched: false,
      data: DEFAULT_STATE,
    });
  }, []);

  return {
    ...state,
    resetGlobalCommonData,
    fetchGlobalCommonData,
    setIsJoinPending,
  };
};
