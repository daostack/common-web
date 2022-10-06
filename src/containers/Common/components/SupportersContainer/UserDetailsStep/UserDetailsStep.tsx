import React, { FC } from "react";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { User } from "@/shared/models";
import { DeadSeaUserDetailsForm } from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface UserDetailsStepProps {
  user: User;
  onFinish: (supportPlan: string) => void;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user, onFinish } = props;
  const { currentTranslation } = useSupportersDataContext();

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper title={currentTranslation.title}>
      <DeadSeaUserDetailsForm user={user} onFinish={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
