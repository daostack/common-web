import React, { FC } from "react";
import { useSelector } from "react-redux";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { ScreenSize } from "@/shared/constants";
import { User } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { DeadSeaUserDetailsForm } from "../DeadSeaUserDetailsForm";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import "./index.scss";

interface UserDetailsStepProps {
  user: User;
  onFinish: (supportPlan: string) => void;
}

const UserDetailsStep: FC<UserDetailsStepProps> = (props) => {
  const { user, onFinish } = props;
  const { currentTranslation } = useSupportersDataContext();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper title={currentTranslation.title}>
      {isMobileView && (
        <h2 className="supporters-page-user-details-step__register-title">
          Register
        </h2>
      )}
      <DeadSeaUserDetailsForm user={user} onFinish={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default UserDetailsStep;
