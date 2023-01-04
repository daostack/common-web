import React, { FC } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { Circle } from "@/shared/models";
import { PopoverItem } from "../PopoverItem";
import styles from "./PopoverPanel.module.scss";
import { selectUser } from "@/pages/Auth/store/selectors";
import { useSelector } from "react-redux";
import { getUserName } from "@/shared/utils";

interface PopoverPanelProps {
  className?: string;
  commonId: string;
  pendingCircles: Map<string, boolean>;
  governanceCircles: Circle[];
  circleIds: string[];
  userId: string;
}

export const PopoverPanel: FC<PopoverPanelProps> = (props) => {
  const {
    className,
    governanceCircles,
    pendingCircles,
    commonId,
    circleIds,
    userId,
  } = props;
  const user = useSelector(selectUser());

  return (
    <Popover.Panel className={classNames(styles.popoverPanel, className)}>
      {governanceCircles.map(
        ({ name, id: circleId, allowedActions }, index) => (
          <PopoverItem
            key={circleId}
            circleName={name}
            governanceCircleIds={governanceCircles
              .slice(0, index + 1)
              .map(({ id }) => id)}
            circleId={circleId}
            commonId={commonId}
            isPending={Boolean(pendingCircles.get(circleId))}
            isMember={circleIds.includes(circleId)}
            canRequestToJoin={circleIds.length === index}
            canLeaveCircle={Boolean(allowedActions.LEAVE_CIRCLE)}
            shouldShowLeaveButton={
              circleIds.length > 1 && index === circleIds.length - 1
            }
            circle={governanceCircles[index]}
            userId={userId}
            userName={getUserName(user)}
          />
        ),
      )}
    </Popover.Panel>
  );
};
