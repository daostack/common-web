import React, { ComponentType, FC } from "react";
import { ShareModal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { StaticLinkType, generateStaticShareLink } from "@/shared/utils";
import { Trigger, TriggerProps } from "./components";

interface InviteFriendsButtonProps {
  isMobileVersion?: boolean;
  common: Common;
  TriggerComponent?: ComponentType<TriggerProps>;
}

const InviteFriendsButton: FC<InviteFriendsButtonProps> = (props) => {
  const { isMobileVersion = false, common } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const TriggerComponent = props.TriggerComponent || Trigger;
  const shareLink = generateStaticShareLink(StaticLinkType.Common, common);

  return (
    <>
      <TriggerComponent onClick={onOpen} isMobileVersion={isMobileVersion} />
      <ShareModal
        isShowing={isShowing}
        sourceUrl={shareLink}
        onClose={onClose}
      />
    </>
  );
};

export default InviteFriendsButton;
