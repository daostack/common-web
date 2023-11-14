import React, { FC } from "react";
import classNames from "classnames";
import {
  Transition as HeadlessUITransition,
  TransitionClasses,
} from "@headlessui/react";
import { ModalTransition } from "@/shared/interfaces";
import styles from "./Transition.module.scss";

interface TransitionProps {
  className?: string;
  show: boolean;
  transition?: ModalTransition;
}

const rightToLeftTransitionClasses: TransitionClasses = {
  enter: styles.rightToLeftTransitionEnter,
  enterTo: styles.rightToLeftTransitionEnterActive,
  leave: styles.rightToLeftTransitionExit,
  leaveTo: styles.rightToLeftTransitionExitActive,
};

const MAP_TRANSITION_TO_CLASSES: Record<ModalTransition, TransitionClasses> = {
  [ModalTransition.BottomToTop]: {},
  [ModalTransition.RightToLeft]: rightToLeftTransitionClasses,
};

const Transition: FC<TransitionProps> = (props) => {
  const { className, show, transition, children } = props;

  if (!transition) {
    return <>{children}</>;
  }

  return (
    <HeadlessUITransition
      className={classNames(className, styles.container)}
      show={show}
      appear
      {...MAP_TRANSITION_TO_CLASSES[transition]}
    >
      {children}
    </HeadlessUITransition>
  );
};

export default Transition;
