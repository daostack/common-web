import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { AboutAction } from "../../constants";
import { EditButton } from "../EditButton";
import { InviteFriendsButton } from "../InviteFriendsButton";
import styles from "./AboutActions.module.scss";

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
        {allowedActions.includes(AboutAction.Edit) && (
          <EditButton isMobileVersion={isMobileVersion} commonId={common.id} />
        )}
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
