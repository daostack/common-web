import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePreviousDistinct, useUpdateEffect } from "react-use";
import { selectUserStreamsWithNotificationsAmount } from "@/pages/Auth/store/selectors";
import { inboxActions } from "@/store/states";

export const useUnreadInboxItems = (unread?: boolean): void => {
  const dispatch = useDispatch();
  const notificationsAmount = useSelector(
    selectUserStreamsWithNotificationsAmount(),
  );
  const previousNotificationsAmount = usePreviousDistinct(notificationsAmount);

  useUpdateEffect(() => {
    if (
      !unread ||
      !notificationsAmount ||
      (typeof previousNotificationsAmount === "number" &&
        notificationsAmount < previousNotificationsAmount)
    ) {
      return;
    }

    dispatch(inboxActions.refreshUnreadInboxItems.request());
  }, [notificationsAmount]);

  useEffect(() => {
    return () => {
      dispatch(
        inboxActions.refreshUnreadInboxItems.cancel(
          "Cancel unread inbox items refresh on unmount",
        ),
      );
    };
  }, []);
};
