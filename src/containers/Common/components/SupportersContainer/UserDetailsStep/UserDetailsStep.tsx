import React, { FC } from "react";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { User } from "@/shared/models";
import {
  DeadSeaUserDetailsForm,
  DeadSeaUserDetailsFormValuesWithoutUserDetails,
} from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface UserDetailsStepProps {
  user: User;
  formData: DeadSeaUserDetailsFormValuesWithoutUserDetails;
  onFinish: (data: DeadSeaUserDetailsFormValuesWithoutUserDetails) => void;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user, formData, onFinish } = props;
  const { currentTranslation } = useSupportersDataContext();

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper title={currentTranslation.title}>
      <DeadSeaUserDetailsForm
        user={user}
        initialData={formData}
        onFinish={onFinish}
      />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
