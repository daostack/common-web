import React, { ComponentType, FC, useEffect, useState } from "react";
import { ShareModal } from "@/shared/components";
import { DynamicLinkType } from "@/shared/constants";
import { useBuildShareLink, useModal } from "@/shared/hooks";
import { Common } from "@/shared/models";
import { Trigger, TriggerProps } from "./components";

interface InviteFriendsButtonProps {
  isMobileVersion?: boolean;
  common: Common;
  TriggerComponent?: ComponentType<TriggerProps>;
}

const InviteFriendsButton: FC<InviteFriendsButtonProps> = (props) => {
  const { isMobileVersion = false, common } = props;
  const { isShowing, onClose, onOpen } = useModal(false);
  const [linkURL, setLinkURL] = useState<string | null>(null);
  const { handleOpen } = useBuildShareLink(
    DynamicLinkType.Common,
    common,
    setLinkURL,
  );
  const TriggerComponent = props.TriggerComponent || Trigger;

  useEffect(() => {
    if (isShowing) {
      handleOpen();
    }
  }, [isShowing]);

  return (
    <>
      <TriggerComponent onClick={onOpen} isMobileVersion={isMobileVersion} />
      <ShareModal
        isShowing={isShowing}
        isLoading={!linkURL}
        sourceUrl={linkURL || ""}
        onClose={onClose}
      />
    </>
  );
};

export default InviteFriendsButton;
