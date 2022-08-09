import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { useQueryParams } from "@/shared/hooks";
import {
  MemberAdmittanceStep,
  UserDetailsStep,
} from "../../components/DeadSeaIntegrationContainer";
import { DeadSeaIntegrationStep } from "./constants";
import { getAmount } from "./helpers";
import "./index.scss";

const DeadSeaIntegrationContainer: FC = () => {
  const dispatch = useDispatch();
  const queryParams = useQueryParams();
  const [step, setStep] = useState(DeadSeaIntegrationStep.UserDetails);
  const user = useSelector(selectUser());
  const amount = getAmount(queryParams);
  const isInitialLoading = !user || !amount;

  const handleMemberAdmittanceStepFinish = () => {
    console.log("handleMemberAdmittanceStepFinish");
  };

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

  const renderContent = () => {
    if (isInitialLoading) {
      return <Loader />;
    }

    switch (step) {
      case DeadSeaIntegrationStep.UserDetails:
        return <UserDetailsStep user={user} />;
      case DeadSeaIntegrationStep.MemberAdmittance:
        return (
          <MemberAdmittanceStep onFinish={handleMemberAdmittanceStepFinish} />
        );
      default:
        return null;
    }
  };

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
        {renderContent()}
      </div>
    </div>
  );
};

export default DeadSeaIntegrationContainer;
