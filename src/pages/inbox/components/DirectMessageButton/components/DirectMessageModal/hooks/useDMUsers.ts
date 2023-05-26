import { useCallback, useState } from "react";
import { ChatService } from "@/services";
import { useIsMounted, useLoadingState } from "@/shared/hooks";
import { DMUser } from "@/shared/interfaces";

interface Return {
  loading: boolean;
  dmUsers: DMUser[];
  fetchDMUsers: (force?: boolean) => void;
  error?: boolean;
}

export const useDMUsers = (): Return => {
  const isMounted = useIsMounted();
  const [state, setState] = useLoadingState<DMUser[]>([]);
  const [error, setError] = useState<boolean>(false);

  const fetchDMUsers = useCallback(
    async (force = true) => {
      if (!force && (state.loading || state.fetched)) {
        return;
      }

      setState({
        loading: true,
        fetched: false,
        data: [],
      });

      let dmUsers: DMUser[] = [];

      try {
        dmUsers = await ChatService.getDMUsers();
      } catch (error) {
        setError(true);
      } finally {
        if (isMounted()) {
          setState({
            loading: false,
            fetched: true,
            data: dmUsers,
          });
        }
      }
    },
    [state],
  );

  return {
    fetchDMUsers,
    loading: state.loading || !state.fetched,
    dmUsers: state.data,
    error: error,
  };
};
