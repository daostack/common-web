import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { InviteFriendsButton } from "../InviteFriendsButton";
import styles from "./AboutActions.module.scss";

export enum AboutAction {
  InviteFriends = "invite-friends",
}

interface FeedActionsProps {
  allowedActions?: AboutAction[];
  common: Common;
}

const AboutActions: FC<FeedActionsProps> = (props) => {
  const { allowedActions = [], common } = props;
  const isMobileVersion = useIsTabletView();

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        {allowedActions.includes(AboutAction.InviteFriends) && (
          <InviteFriendsButton
            isMobileVersion={isMobileVersion}
            common={common}
          />
        )}
      </div>
    </div>
  );
};

export default AboutActions;
