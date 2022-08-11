import React, { FC } from "react";
import { User } from "@/shared/models";
import { DeadSeaUserDetailsForm } from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface UserDetailsStepProps {
  user: User;
  onFinish: (supportPlan: string) => void;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user, onFinish } = props;

  return (
    <GeneralInfoWrapper>
      <DeadSeaUserDetailsForm user={user} onFinish={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
