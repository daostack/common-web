import React, { FC } from "react";
import { ShareModal } from "@/shared/components";
import { ShareViewType } from "@/shared/constants";
import { Discussion } from "@/shared/models";
import { StaticLinkType, generateStaticShareLink } from "@/shared/utils";

interface FeedCardShareProps {
  isOpen: boolean;
  onClose: () => void;
  linkType: StaticLinkType;
  element: Discussion;
  feedItemId: string;
  isMobileVersion?: boolean;
}

export const FeedCardShare: FC<FeedCardShareProps> = (props) => {
  const {
    isOpen,
    onClose,
    linkType,
    element,
    feedItemId,
    isMobileVersion = false,
  } = props;

  return (
    <ShareModal
      isShowing={isOpen}
      sourceUrl={generateStaticShareLink(linkType, element, feedItemId)}
      onClose={onClose}
      type={
        isMobileVersion ? ShareViewType.ModalMobile : ShareViewType.ModalDesktop
      }
    />
  );
};
