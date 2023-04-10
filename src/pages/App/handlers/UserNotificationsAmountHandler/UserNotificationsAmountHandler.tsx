import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserNotificationsAmount } from "@/pages/Auth/store/actions";
import { selectUser } from "@/pages/Auth/store/selectors";
import { UserService } from "@/services";

const UserNotificationsAmountHandler: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const userId = user?.uid;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = UserService.subscribeToUser(userId, (updatedUser) => {
      dispatch(setUserNotificationsAmount(updatedUser.inboxCounter ?? null));
    });

    return unsubscribe;
  }, [dispatch, userId]);

  return null;
};

export default UserNotificationsAmountHandler;
