import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import {
  getCommonsListByIds,
  getUserContributions,
  getUserSubscriptions,
} from "@/containers/Common/store/actions";
import {
  Common,
  Payment,
  PaymentStatus,
  Subscription,
  isPayment,
} from "@/shared/models";

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

export interface CommonNamesState {
  loading: boolean;
  fetched: boolean;
  data: Common[];
}

interface Return {
  loading: boolean;
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commons: CommonNamesState["data"];
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
  const [commonNamesState, setCommonNamesState] = useState<CommonNamesState>({
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
      const aDate = isPayment(a) ? a.createdAt : a.lastChargedAt;
      const bDate = isPayment(b) ? b.createdAt : b.lastChargedAt;

      if (!bDate) {
        return -1;
      }
      if (!aDate) {
        return 1;
      }

      return bDate.seconds - aDate.seconds;
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
          const data = payments?.filter(
            (item) =>
              (!item.subscriptionId &&
                item.status === PaymentStatus.Confirmed) ||
              item.status === PaymentStatus.Failed
          );

          setPaymentsState({
            loading: false,
            fetched: true,
            data: data || [],
          });
        },
      })
    );
  }, [dispatch, paymentsState, user]);

  useEffect(() => {
    if (
      !paymentsState.fetched ||
      !subscriptionsState.fetched ||
      commonNamesState.loading ||
      commonNamesState.fetched ||
      !user?.uid
    ) {
      return;
    }

    if (
      paymentsState.data.length === 0 &&
      subscriptionsState.data.length === 0
    ) {
      setCommonNamesState((nextState) => ({
        ...nextState,
        fetched: true,
      }));

      return;
    }

    setCommonNamesState((nextState) => ({
      ...nextState,
      loading: true,
    }));

    const commonIdsSet = new Set(
      [
        ...paymentsState.data.map((item) => item.commonId),
        ...subscriptionsState.data.map((item) => item.metadata.common.id),
      ].filter((item): item is string => Boolean(item))
    );

    dispatch(
      getCommonsListByIds.request({
        payload: Array.from(commonIdsSet),
        callback: (error, commons) => {
          setCommonNamesState({
            loading: false,
            fetched: true,
            data: commons || [],
          });
        },
      })
    );
  }, [
    dispatch,
    paymentsState.fetched,
    paymentsState.data,
    subscriptionsState.fetched,
    subscriptionsState.data,
    commonNamesState,
    user,
  ]);

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
    loading: isLoading || !commonNamesState.fetched,
    subscriptions: subscriptionsState.data,
    contributions,
    commons: commonNamesState.data,
  };
};

export default useUserContributions;
