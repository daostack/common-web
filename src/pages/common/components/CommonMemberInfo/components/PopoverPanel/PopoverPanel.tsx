import React, { FC } from "react";
import classNames from "classnames";
import { Popover } from "@headlessui/react";
import { Circle } from "@/shared/models";
import { PopoverItem } from "../PopoverItem";
import styles from "./PopoverPanel.module.scss";

interface PopoverPanelProps {
  className?: string;
  commonId: string;
  pendingCircles: Map<string, boolean>;
  governanceCircles: Circle[];
  circleIds: string[];
}

export const PopoverPanel: FC<PopoverPanelProps> = (props) => {
  const { className, governanceCircles, pendingCircles, commonId, circleIds } =
    props;

  return (
    <Popover.Panel className={classNames(styles.popoverPanel, className)}>
      {governanceCircles.map(({ name, id: circleId }) => (
        <PopoverItem
          key={circleId}
          circleName={name}
          circleId={circleId}
          commonId={commonId}
          isPending={Boolean(pendingCircles.get(circleId))}
          isMember={circleIds.includes(circleId)}
        />
      ))}
    </Popover.Panel>
  );
};
