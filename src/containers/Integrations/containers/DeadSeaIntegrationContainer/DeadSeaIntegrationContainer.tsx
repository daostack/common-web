import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import "./index.scss";

const DeadSeaIntegrationContainer: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());

  useEffect(() => {
    if (!user) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          title: "Dead Sea Guardians Common",
          canCloseModal: false,
          shouldShowUserDetailsAfterSignUp: false,
        })
      );
    }
  }, [dispatch, user]);

  return (
    <div className="dead-sea-integration">DeadSeaIntegrationContainer</div>
  );
};

export default DeadSeaIntegrationContainer;
