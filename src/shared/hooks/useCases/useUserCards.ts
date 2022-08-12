import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { loadUserCards } from "@/containers/Common/store/actions";
import { useLoadingState } from "@/shared/hooks";
import { LoadingState } from "@/shared/interfaces";
import { Card } from "@/shared/models";

interface Return extends LoadingState<Card[]> {
  fetchUserCards: () => void;
}

const useUserCards = (): Return => {
  const dispatch = useDispatch();
  const [cardsState, setCardsState] = useLoadingState<Card[]>([]);

  const fetchUserCards = useCallback(() => {
    setCardsState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    dispatch(
      loadUserCards.request({
        callback: (error, cards) => {
          setCardsState({
            loading: false,
            fetched: true,
            data: !error && cards ? cards : [],
          });
        },
      })
    );
  }, [dispatch]);

  return {
    ...cardsState,
    fetchUserCards,
  };
};

export default useUserCards;
