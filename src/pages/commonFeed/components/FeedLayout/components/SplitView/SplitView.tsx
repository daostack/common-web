import React, { FC } from "react";
import SplitPane from "react-split-pane";
import styles from "./SplitView.module.scss";

interface SplitViewProps {
  minSize: number;
  maxSize: number;
  onChange?: (newSize: number) => void;
}

const SplitView: FC<SplitViewProps> = (props) => {
  const { minSize, maxSize, onChange, children } = props;

  return (
    <SplitPane
      split="vertical"
      primary="second"
      minSize={minSize}
      maxSize={maxSize}
      onChange={onChange}
      resizerClassName={styles.resizer}
      style={{
        position: "relative",
        overflow: "unset",
      }}
    >
      {children}
      <div />
    </SplitPane>
  );
};

export default SplitView;
