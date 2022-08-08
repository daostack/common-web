import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { useQueryParams } from "@/shared/hooks";
import { getAmount } from "./helpers";
import "./index.scss";

const DeadSeaIntegrationContainer: FC = () => {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const user = useSelector(selectUser());
  const amount = getAmount(queryParams);
  const isInitialLoading = !user || !amount;

  useEffect(() => {
    if (!user && amount) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          title: "Dead Sea Guardians Common",
          canCloseModal: false,
          shouldShowUserDetailsAfterSignUp: false,
        })
      );
    }
  }, [dispatch, user, amount]);

  return (
    <div className="dead-sea-integration">
      <div className="dead-sea-integration__content">
        <div className="dead-sea-integration__main-image-wrapper">
          <img
            className="dead-sea-integration__main-image"
            src="/assets/images/dead-sea-integration.png"
            alt="Dead Sea"
          />
        </div>
        {isInitialLoading && <Loader />}
      </div>
    </div>
  );
};

export default DeadSeaIntegrationContainer;
