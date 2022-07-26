import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { Circle, CommonMemberWithUserInfo } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { MemberInfo } from "../MemberInfo";
import "./index.scss";

interface ConfirmationProps {
  circle: Circle;
  commonMember: CommonMemberWithUserInfo;
  onSubmit: () => void;
  onCancel: () => void;
}

const Confirmation: FC<ConfirmationProps> = (props) => {
  const { circle, commonMember, onSubmit, onCancel } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <div className="remove-circle-confirmation">
      <img
        className="remove-circle-confirmation__image"
        src="/icons/social-login/account-avatar.svg"
        alt="Avatar"
      />
      <h4 className="remove-circle-confirmation__title">Remove Circle</h4>
      <p className="remove-circle-confirmation__circle-name">{circle.name}</p>
      <MemberInfo user={commonMember.user} />
      <div className="remove-circle-confirmation__buttons-wrapper">
        <Button
          className="remove-circle-confirmation__cancel-button"
          onClick={onCancel}
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
          shouldUseFullWidth
        >
          Cancel
        </Button>
        <Button onClick={onSubmit} shouldUseFullWidth>
          Create Proposal
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
