import React, { FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Circle } from "@/shared/models";
import { getUserName } from "@/shared/utils";
import { PopoverItem } from "../PopoverItem";
import styles from "./PopoverPanel.module.scss";

interface PopoverPanelProps {
  className?: string;
  commonId: string;
  pendingCircles: Map<string, boolean>;
  governanceCircles: Circle[];
  circleIds: string[];
  circleMembersCount: Map<string, number>;
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
    circleMembersCount,
  } = props;
  const user = useSelector(selectUser());

  return (
    <Popover.Panel className={classNames(styles.popoverPanel, className)}>
      {governanceCircles.map(
        ({ name, id: circleId, allowedActions }, index) => (
          <PopoverItem
            key={circleId}
            circleName={name}
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
            membersCount={circleMembersCount.get(circleId) ?? 0}
          />
        ),
      )}
    </Popover.Panel>
  );
};
