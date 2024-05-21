import React, { FC } from "react";
import { CommonCircleChange } from "../../types";
import styles from "./ChangeItem.module.scss";

interface ChangeItemProps {
  change: CommonCircleChange;
}

const ChangeItem: FC<ChangeItemProps> = (props) => {
  const { change } = props;

  return (
    <li className={styles.container}>
      <span className={styles.title}>{change.commonName}</span>
      {change.removedUsers.length > 0 && (
        <span className={styles.text}>
          The following users will be removed from {change.commonName}:{" "}
          {change.removedUsers.map(({ userName }) => userName).join(", ")}
        </span>
      )}
      {change.changes.map(
        ({ circleId, circleName, addedUsers, removedUsers }) => (
          <React.Fragment key={circleId}>
            {addedUsers.length > 0 && (
              <span className={styles.text}>
                The following users will be added to {circleName}:{" "}
                {addedUsers.map(({ userName }) => userName).join(", ")}
              </span>
            )}
            {removedUsers.length > 0 && (
              <span className={styles.text}>
                The following users will be removed from {circleName}:{" "}
                {removedUsers.map(({ userName }) => userName).join(", ")}
              </span>
            )}
          </React.Fragment>
        ),
      )}
    </li>
  );
};

export default ChangeItem;
