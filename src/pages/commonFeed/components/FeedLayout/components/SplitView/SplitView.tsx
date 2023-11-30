import React, { FC } from "react";
import SplitPane from "react-split-pane";
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

  return (
    <SplitPane
      className={className}
      split="vertical"
      primary="second"
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
        overflow: "scroll",
        height: "100vh",
      }}
    >
      {children}
      <div />
    </SplitPane>
  );
};

export default SplitView;
