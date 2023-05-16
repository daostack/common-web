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
  feedCardId: string;
  isMobileVersion?: boolean;
}

export const FeedCardShare: FC<FeedCardShareProps> = (props) => {
  const {
    isOpen,
    onClose,
    linkType,
    element,
    feedCardId,
    isMobileVersion = false,
  } = props;

  return (
    <ShareModal
      isShowing={isOpen}
      sourceUrl={generateStaticShareLink(linkType, element, feedCardId)}
      onClose={onClose}
      type={
        isMobileVersion ? ShareViewType.ModalMobile : ShareViewType.ModalDesktop
      }
    />
  );
};
