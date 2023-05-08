import React, { FC } from "react";
import SplitPane from "react-split-pane";
import styles from "./SplitView.module.scss";

interface SplitViewProps {
  minSize: number;
  maxSize: number;
  defaultSize?: number;
  onChange?: (newSize: number) => void;
}

const SplitView: FC<SplitViewProps> = (props) => {
  const { minSize, maxSize, defaultSize, onChange, children } = props;

  return (
    <SplitPane
      split="vertical"
      primary="second"
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
        overflow: "hidden",
      }}
    >
      {children}
      <div />
    </SplitPane>
  );
};

export default SplitView;
