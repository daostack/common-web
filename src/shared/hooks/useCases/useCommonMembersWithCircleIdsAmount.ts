import { useCallback } from "react";
import { getCommonMembersWithCircleIdAmount } from "@/containers/Common/store/api";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";

interface Data {
  circleId: string;
  amount: number;
}

type State = LoadingState<Data[]>;

interface Return extends State {
  fetchCommonMembersWithCircleIdAmount: (
    commonId: string,
    circleIds: string[]
  ) => void;
}

export const useCommonMembersWithCircleIdsAmount = (
  isLoading?: boolean
): Return => {
  const [state, setState] = useLoadingState<Data[]>([], {
    loading: isLoading,
  });

  const fetchCommonMembersWithCircleIdAmount = useCallback(
    (commonId: string, circleIds: string[]) => {
      setState((nextState) => ({
        ...nextState,
        loading: true,
      }));

      (async () => {
        try {
          const amounts = await Promise.all(
            circleIds.map(async (circleId): Promise<Data> => {
              const amount = await getCommonMembersWithCircleIdAmount(
                commonId,
                circleId
              );

              return {
                circleId,
                amount,
              };
            })
          );

          setState({
            loading: false,
            fetched: true,
            data: amounts,
          });
        } catch (error) {
          setState({
            loading: false,
            fetched: true,
            data: circleIds.map((circleId) => ({
              circleId,
              amount: 0,
            })),
          });
        }
      })();
    },
    []
  );

  return {
    ...state,
    fetchCommonMembersWithCircleIdAmount,
  };
};
