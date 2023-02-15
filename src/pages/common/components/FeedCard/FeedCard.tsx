import React, { FC, useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { CommonCard } from "../CommonCard";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  className?: string;
  isActive?: boolean;
  isLongPressed?: boolean;
  isHovering?: boolean;
  onLongPress?: () => void;
}

export const FeedCard: FC<FeedCardProps> = (props) => {
  const {
    className,
    isActive = false,
    isLongPressed = false,
    isHovering = false,
    onLongPress,
    children,
  } = props;
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    }

    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(onLongPress ? handleLongPress : null, {
    threshold: 400,
    cancelOnMovement: true,
    onStart: () => setIsLongPressing(true),
    onFinish: () => setIsLongPressing(false),
    onCancel: () => setIsLongPressing(false),
  });

  return (
    <CommonCard
      className={classNames(
        styles.container,
        {
          [styles.containerActive]: isActive,
          [styles.containerLongPressing]: isLongPressing || isLongPressed,
          [styles.containerHovering]: isHovering,
        },
        className,
      )}
      {...getLongPressProps()}
    >
      {children}
    </CommonCard>
  );
};
