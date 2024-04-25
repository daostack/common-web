import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { history } from "@/shared/appConfig";
import { getInboxPagePath } from "@/shared/utils";
import { selectUser } from "../Auth/store/selectors";

const EmptyPage: FC = () => {
  const user = useSelector(selectUser());

  useEffect(() => {
    if (user) {
      history.push(getInboxPagePath());
    }
  }, [user]);

  return null;
};

export default EmptyPage;
