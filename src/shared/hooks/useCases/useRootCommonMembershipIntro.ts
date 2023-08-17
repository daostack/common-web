import { useCallback, useState } from "react";
import { CommonService, ProposalService } from "@/services";
import { useIsMounted, useLoadingState } from "@/shared/hooks";

interface Return {
  isMembershipIntroLoading: boolean;
  membershipIntro: string;
  fetchMembershipIntro: (
    commonId: string,
    userId: string,
    force?: boolean,
  ) => void;
  setMembershipIntro: (membershipIntro: string) => void;
  error?: boolean;
}

export const useRootCommonMembershipIntro = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<string>("");
  const [error, setError] = useState<boolean>(false);

  const fetchMembershipIntro = useCallback(
    async (commonId: string, userId: string, force = true) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: "",
      });

      let membershipIntro = "";

      try {
        const rootCommon = await CommonService.getParentCommonForCommonId(
          commonId,
        );

        if (rootCommon) {
          const proposal =
            await ProposalService.getUserMemberAdmittanceProposalByCommonId(
              userId,
              rootCommon.id,
            );
          membershipIntro = proposal?.data.args.description || "";
        }
      } catch (error) {
        setError(true);
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data: membershipIntro,
          });
        }
      }
    },
    [state],
  );

  const setMembershipIntro = useCallback((membershipIntro: string) => {
    setState({
      loading: false,
      fetched: true,
      data: membershipIntro,
    });
  }, []);

  return {
    fetchMembershipIntro,
    setMembershipIntro,
    isMembershipIntroLoading: state.loading || !state.fetched,
    membershipIntro: state.data,
    error,
  };
};
