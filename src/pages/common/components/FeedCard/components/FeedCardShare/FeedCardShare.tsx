import React, { FC, useEffect, useState } from "react";
import { ShareModal } from "@/shared/components";
import { DynamicLinkType, ShareViewType } from "@/shared/constants";
import { useBuildShareLink } from "@/shared/hooks";
import { Discussion } from "@/shared/models";

interface FeedCardShareProps {
  isOpen: boolean;
  onClose: () => void;
  linkType: DynamicLinkType;
  element: Discussion;
  isMobileVersion?: boolean;
}

export const FeedCardShare: FC<FeedCardShareProps> = (props) => {
  const { isOpen, onClose, linkType, element, isMobileVersion = false } = props;
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const { handleOpen } = useBuildShareLink(linkType, element, setLinkURL);

  useEffect(() => {
    if (isOpen) {
      handleOpen();
    }
  }, [isOpen]);

  return (
    <ShareModal
      isShowing={isOpen}
      isLoading={!linkURL}
      sourceUrl={linkURL || ""}
      onClose={onClose}
      type={
        isMobileVersion ? ShareViewType.ModalMobile : ShareViewType.ModalDesktop
      }
    />
  );
};
