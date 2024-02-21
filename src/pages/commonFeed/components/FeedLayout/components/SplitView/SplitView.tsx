import React, { FC, useEffect } from "react";
import SplitPane from "react-split-pane";
import { useLockedBody } from "@/shared/hooks";
import styles from "./SplitView.module.scss";

interface SplitViewProps {
  className?: string;
  size: number;
  minSize: number;
  maxSize: number;
  defaultSize?: number;
  onChange?: (newSize: number) => void;
}

const SplitView: FC<SplitViewProps> = (props) => {
  const { className, size, minSize, maxSize, defaultSize, onChange, children } =
    props;
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();

  useEffect(() => {
    lockBodyScroll();
    return () => {
      unlockBodyScroll();
    };
  }, []);

  return (
    <SplitPane
      className={className}
      split="vertical"
      primary="first"
      size={size}
      minSize={minSize}
      maxSize={maxSize}
      defaultSize={defaultSize}
      onChange={onChange}
      resizerClassName={styles.resizer}
      style={{
        position: "relative",
        overflow: "unset",
      }}
      paneStyle={{
        display: "flex",
        flexDirection: "column",
      }}
      pane1Style={{
        overflow: "auto",
        height: "calc(100vh - var(--split-view-top))",
      }}
    >
      {children}
      <div />
    </SplitPane>
  );
};

export default SplitView;
