import React, { FC } from "react";
import { Transition as HeadlessUITransition } from "@headlessui/react";
import styles from "./Transition.module.scss";

interface TransitionProps {
  className?: string;
  show?: boolean;
}

const Transition: FC<TransitionProps> = (props) => {
  const { className, show, children } = props;

  return (
    <HeadlessUITransition
      className={className}
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
