import React, { FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { User } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { DeadSeaUserDetailsForm } from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../../../../Common/components/SupportersContainer/GeneralInfoWrapper";
import "./index.scss";

interface UserDetailsStepProps {
  user: User;
  onFinish: (supportPlan: string) => void;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user, onFinish } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <GeneralInfoWrapper>
      {isMobileView && (
        <h2 className="dead-sea-user-details-step__register-title">Register</h2>
      )}
      <DeadSeaUserDetailsForm user={user} onFinish={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
