import React, { FC, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { ContextMenuItem } from "@/shared/interfaces";
import { CommonCard } from "../CommonCard";
import { FeedCardPreview } from "./components";
import styles from "./FeedCard.module.scss";

interface FeedCardProps {
  className?: string;
  isActive?: boolean;
  isExpanded?: boolean;
  isHovering?: boolean;
  lastActivity?: number;
  unreadMessages?: number;
  onClick?: () => void;
  title?: string;
  canBeExpanded?: boolean;
  lastMessage?: string;
  isPreviewMode?: boolean;
  menuItems?: ContextMenuItem[];
}

const MOBILE_HEADER_HEIGHT = 52;
const DESKTOP_HEADER_HEIGHT = 72;

export const FeedCard: FC<FeedCardProps> = (props) => {
  const {
    className,
    isActive = false,
    isExpanded: isExpandedExternal = false,
    isHovering = false,
    lastActivity = 0,
    unreadMessages = 0,
    canBeExpanded = true,
    onClick,
    children,
    title,
    lastMessage,
    isPreviewMode = true,
    menuItems,
  } = props;
  const isTabletView = useIsTabletView();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setExpanded(false);
    }
  }, [isActive]);

  useEffect(() => {
    setExpanded(isExpandedExternal);
  }, [isExpandedExternal]);

  function scrollToTargetAdjusted() {
    const headerOffset = isTabletView
      ? MOBILE_HEADER_HEIGHT
      : DESKTOP_HEADER_HEIGHT;
    const elementPosition =
      containerRef.current?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (isExpanded && containerRef?.current) {
      scrollToTargetAdjusted();
    }
  }, [isExpanded]);

  const handleClick = () => {
    if (!isTabletView) {
      setExpanded((expanded) => !expanded);
    }
    onClick && onClick();
  };

  const handleExpand = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    setExpanded((expanded) => !expanded);
  };

  return (
    <div ref={containerRef}>
      {!isPreviewMode && (
        <FeedCardPreview
          lastActivity={lastActivity}
          unreadMessages={unreadMessages}
          isActive={isActive}
          isExpanded={isExpanded}
          canBeExpanded={canBeExpanded}
          onClick={handleClick}
          onExpand={handleExpand as () => void}
          title={title}
          lastMessage={lastMessage}
          menuItems={menuItems}
        />
      )}
      {((isExpanded && canBeExpanded) || isPreviewMode) && (
        <CommonCard
          className={classNames(
            styles.container,
            {
              [styles.containerActive]:
                (isActive || (isExpanded && isTabletView)) && !isPreviewMode,
              [styles.containerHovering]: isHovering && !isPreviewMode,
            },
            className,
          )}
        >
          {children}
        </CommonCard>
      )}
    </div>
  );
};
