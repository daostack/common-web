import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { NewCollaborationButton } from "../NewCollaborationButton";
import styles from "./FeedActions.module.scss";

export enum FeedAction {
  NewCollaboration = "new-collaboration",
}

interface FeedActionsProps {
  allowedActions?: FeedAction[];
}

const FeedActions: FC<FeedActionsProps> = (props) => {
  const { allowedActions = [] } = props;
  const isTabletView = useIsTabletView();
  const isIconVersion = isTabletView;

  if (allowedActions.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={styles.container}>
        {allowedActions.includes(FeedAction.NewCollaboration) && (
          <NewCollaborationButton isIconVersion={isIconVersion} />
        )}
      </div>
    </div>
  );
};

export default FeedActions;
