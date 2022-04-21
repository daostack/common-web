import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  getUserContributions,
  getUserSubscriptions,
} from "@/containers/Common/store/actions";
import { Payment, Subscription } from "@/shared/models";

export interface PaymentsState {
  loading: boolean;
  fetched: boolean;
  data: Payment[];
}

export interface SubscriptionsState {
  loading: boolean;
  fetched: boolean;
  data: Subscription[];
}

interface Return {
  loading: boolean;
  contributions: (Payment | Subscription)[];
}

const useUserContributions = (): Return => {
  const dispatch = useDispatch();
  const [paymentsState, setPaymentsState] = useState<PaymentsState>({
    loading: false,
    fetched: false,
    data: [],
  });
  const [
    subscriptionsState,
    setSubscriptionsState,
  ] = useState<SubscriptionsState>({
    loading: false,
    fetched: false,
    data: [],
  });
  const user = useSelector(selectUser());
  const isLoading = !paymentsState.fetched || !subscriptionsState.fetched;
  const contributions = useMemo<Return["contributions"]>(() => {
    if (isLoading) {
      return [];
    }

    return [...paymentsState.data, ...subscriptionsState.data].sort((a, b) => {
      if (!b.createdAt) {
        return -1;
      }
      if (!a.createdAt) {
        return 1;
      }

      return b.createdAt.seconds - a.createdAt.seconds;
    });
  }, [isLoading, paymentsState.data, subscriptionsState.data]);

  useEffect(() => {
    if (paymentsState.loading || paymentsState.fetched || !user?.uid) {
      return;
    }

    setPaymentsState((nextState) => ({
      ...nextState,
      loading: true,
    }));
    dispatch(
      getUserContributions.request({
        payload: user.uid,
        callback: (error, payments) => {
          setPaymentsState({
            loading: false,
            fetched: true,
            data: payments || [],
          });
        },
      })
    );
  }, [dispatch, paymentsState, user]);

  useEffect(() => {
    if (
      subscriptionsState.loading ||
      subscriptionsState.fetched ||
      !user?.uid
    ) {
      return;
    }

    setSubscriptionsState((nextState) => ({
      ...nextState,
      loading: true,
    }));
    dispatch(
      getUserSubscriptions.request({
        payload: user.uid,
        callback: (error, subscriptions) => {
          setSubscriptionsState({
            loading: false,
            fetched: true,
            data: subscriptions || [],
          });
        },
      })
    );
  }, [dispatch, subscriptionsState, user]);

  return {
    loading: isLoading,
    contributions,
  };
};

export default useUserContributions;
