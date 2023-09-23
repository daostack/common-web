import React, { FC } from "react";
import { ShareModal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { CommonFollowState } from "@/shared/hooks/useCases/useCommonFollow";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { DesktopMenu, MenuButton } from "@/shared/ui-kit";
import { StaticLinkType, generateStaticShareLink } from "@/shared/utils";
import { useMenuItems } from "./hooks";

interface ActionsButtonProps {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  commonFollow: CommonFollowState;
  isMobileVersion: boolean;
}

const ActionsButton: FC<ActionsButtonProps> = (props) => {
  const { common, commonMember, commonFollow, isMobileVersion } = props;
  const {
    isShowing: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useModal(false);
  const items = useMenuItems(
    {
      common,
      commonMember,
      isMobileVersion,
      isFollowInProgress: commonFollow.isFollowInProgress,
    },
    {
      share: onShareModalOpen,
      onFollowToggle: commonFollow.onFollowToggle,
    },
  );
  const shareLink = generateStaticShareLink(StaticLinkType.Common, common);

  return (
    <>
      {items.length > 0 && (
        <DesktopMenu triggerEl={<MenuButton />} items={items} />
      )}
      <ShareModal
        sourceUrl={shareLink}
        isShowing={isShareModalOpen}
        onClose={onShareModalClose}
      />
    </>
  );
};

export default ActionsButton;
