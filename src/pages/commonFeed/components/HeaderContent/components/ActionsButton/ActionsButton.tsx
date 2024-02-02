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
  onSearchClick?: () => void;
  onClick?: () => void;
}

const ActionsButton: FC<ActionsButtonProps> = (props) => {
  const { common, commonMember, commonFollow, onClick, onSearchClick } = props;
  const {
    isShowing: isShareModalOpen,
    onOpen: onShareModalOpen,
    onClose: onShareModalClose,
  } = useModal(false);
  const items = useMenuItems(
    {
      common,
      commonMember,
      isFollowInProgress: commonFollow.isFollowInProgress,
      isSearchActionAvailable: Boolean(onSearchClick),
    },
    {
      share: onShareModalOpen,
      onFollowToggle: commonFollow.onFollowToggle,
      onSearchClick,
    },
  );
  const shareLink = generateStaticShareLink(StaticLinkType.Common, common);
  const triggerEl = <MenuButton onClick={onClick} />;

  return (
    <>
      {items.length > 0 && <DesktopMenu triggerEl={triggerEl} items={items} />}
      <ShareModal
        sourceUrl={shareLink}
        isShowing={isShareModalOpen}
        onClose={onShareModalClose}
      />
    </>
  );
};

export default ActionsButton;
