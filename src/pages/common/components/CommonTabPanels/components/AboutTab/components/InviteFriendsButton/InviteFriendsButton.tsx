import React, { FC, useEffect, useState } from "react";
import { ShareModal } from "@/shared/components";
import { DynamicLinkType, ShareViewType } from "@/shared/constants";
import { useBuildShareLink, useModal } from "@/shared/hooks";
import { InviteFriendsIcon, ShareIcon } from "@/shared/icons";
import { Common } from "@/shared/models";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./InviteFriendsButton.module.scss";

interface InviteFriendsButtonProps {
  isMobileVersion?: boolean;
  common: Common;
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

  useEffect(() => {
    if (isShowing) {
      handleOpen();
    }
  }, [isShowing]);

  const buttonVariant = ButtonVariant.OutlineBlue;
  const iconEl = <InviteFriendsIcon className={styles.icon} />;

  return (
    <>
      {isMobileVersion ? (
        <ButtonIcon onClick={onOpen} variant={buttonVariant}>
          <ShareIcon className={styles.icon} />
        </ButtonIcon>
      ) : (
        <Button
          onClick={onOpen}
          variant={buttonVariant}
          size={ButtonSize.Xsmall}
          leftIcon={iconEl}
        >
          Invite friends
        </Button>
      )}

      <ShareModal
        isShowing={isShowing}
        isLoading={!linkURL}
        sourceUrl={linkURL || ""}
        onClose={onClose}
        type={
          isMobileVersion
            ? ShareViewType.ModalMobile
            : ShareViewType.ModalDesktop
        }
      />
    </>
  );
};

export default InviteFriendsButton;
