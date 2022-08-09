import React, { FC } from "react";
import { User } from "@/shared/models";
import { DeadSeaUserDetailsForm } from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface UserDetailsStepProps {
  user: User;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user } = props;

  return (
    <GeneralInfoWrapper>
      <DeadSeaUserDetailsForm user={user} />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
