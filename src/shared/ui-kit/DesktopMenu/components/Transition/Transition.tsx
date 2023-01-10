import React, { FC } from "react";
import { Transition as HeadlessUITransition } from "@headlessui/react";
import styles from "./Transition.module.scss";

interface TransitionProps {
  show?: boolean;
}

const Transition: FC<TransitionProps> = (props) => {
  const { show, children } = props;

  return (
    <HeadlessUITransition
      show={show}
      enter={styles.menuTransitionEnter}
      enterTo={styles.menuTransitionEnterActive}
      leave={styles.menuTransitionExit}
      leaveTo={styles.menuTransitionExitActive}
    >
      {(show || typeof show === "undefined") && children}
    </HeadlessUITransition>
  );
};

export default Transition;
