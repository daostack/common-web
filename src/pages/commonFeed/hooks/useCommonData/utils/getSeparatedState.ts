import { LoadingState } from "@/shared/interfaces";
import { SupportersData } from "@/shared/models";
import { SeparatedState } from "../types";

interface States {
  supportersState: LoadingState<SupportersData | null>;
}

export const getSeparatedState = (states: States): SeparatedState => {
  const { supportersState } = states;
  const isLoading = supportersState.loading;
  const isFetched = supportersState.fetched;

  return {
    loading: isLoading,
    fetched: isFetched,
    data: {
      supportersData: supportersState.data,
    },
  };
};
