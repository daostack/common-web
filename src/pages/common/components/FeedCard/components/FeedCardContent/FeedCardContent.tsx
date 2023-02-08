import React, { ReactNode, useState } from "react";
import classNames from "classnames";
import { useLongPress } from "use-long-press";
import { CommonLink } from "@/shared/models";
import { FeedGeneralInfo } from "../FeedGeneralInfo";
import styles from "./FeedCardContent.module.scss";

export type FeedCardContentProps = JSX.IntrinsicElements["div"] & {
  title?: string;
  subtitle?: ReactNode;
  description?: string;
  images?: CommonLink[];
  onLongPress: () => void;
};

export const FeedCardContent: React.FC<FeedCardContentProps> = (props) => {
  const { children, title, description, subtitle, images, onLongPress } = props;
  const [isLongPressing, setIsLongPressing] = useState(false);
  const handleLongPress = () => {
    onLongPress();

    setIsLongPressing(false);
  };

  const getLongPressProps = useLongPress(handleLongPress, {
    threshold: 400,
    cancelOnMovement: true,
    onStart: () => setIsLongPressing(true),
    onFinish: () => setIsLongPressing(false),
    onCancel: () => setIsLongPressing(false),
  });

  return (
    <div
      className={classNames(styles.container, {
        [styles.longPressingWrapper]: isLongPressing,
      })}
      {...getLongPressProps()}
    >
      <FeedGeneralInfo
        title={title}
        description={description}
        subtitle={subtitle}
        images={images}
      />
      {children}
    </div>
  );
};
