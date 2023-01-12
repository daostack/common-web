import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { CirclesPermissions, CommonMember, Governance } from "@/shared/models";
import { NewCollaborationButton } from "../NewCollaborationButton";
import styles from "./FeedActions.module.scss";

export enum FeedAction {
  NewCollaboration = "new-collaboration",
}

interface FeedActionsProps {
  allowedActions?: FeedAction[];
  commonMember: (CommonMember & CirclesPermissions) | null;
  governance: Pick<Governance, "circles">;
}

const FeedActions: FC<FeedActionsProps> = (props) => {
  const { allowedActions = [], commonMember, governance } = props;
  const isMobileVersion = useIsTabletView();

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        {allowedActions.includes(FeedAction.NewCollaboration) && (
          <NewCollaborationButton
            isMobileVersion={isMobileVersion}
            commonMember={commonMember}
            governance={governance}
          />
        )}
      </div>
    </div>
  );
};

export default FeedActions;
