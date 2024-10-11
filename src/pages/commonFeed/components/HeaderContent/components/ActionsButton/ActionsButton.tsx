import React, { FC } from "react";
import copyToClipboard from "copy-to-clipboard";
import { useNotification } from "@/shared/hooks";
import { CommonFollowState } from "@/shared/hooks/useCases/useCommonFollow";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { DesktopMenu, MenuButton } from "@/shared/ui-kit";
import { StaticLinkType, generateStaticShareLink } from "@/shared/utils";
import { useMenuItems } from "./hooks";
import { useUpdateCommonSeenState } from "@/shared/hooks/useCases";
import { ShareButtonText } from "@/shared/constants";

interface ActionsButtonProps {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
  commonFollow: CommonFollowState;
  onSearchClick?: () => void;
  onClick?: () => void;
}

const ActionsButton: FC<ActionsButtonProps> = (props) => {
  const { common, commonMember, commonFollow, onClick, onSearchClick } = props;
  const { notify } = useNotification();
  const { markCommonAsSeen } = useUpdateCommonSeenState();
  const shareLink = generateStaticShareLink(StaticLinkType.Common, common);
  const items = useMenuItems(
    {
      common,
      commonMember,
      isFollowInProgress: commonFollow.isFollowInProgress,
      isSearchActionAvailable: Boolean(onSearchClick),
      shareText: ShareButtonText.Space,
    },
    {
      share: () => {
        copyToClipboard(shareLink);
        notify("The link has been copied!");
      },
      onFollowToggle: commonFollow.onFollowToggle,
      onSearchClick,
      markCommonAsSeen
    },
  );

  const triggerEl = <MenuButton onClick={onClick} />;

  return (
    <>
      {items.length > 0 && <DesktopMenu triggerEl={triggerEl} items={items} />}
    </>
  );
};

export default ActionsButton;
