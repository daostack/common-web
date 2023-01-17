import React, { FC } from "react";
import firebase from "firebase/app";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./Countdown.module.scss";

interface CountdownProps {
  timer: string;
  isCountdownFinished: boolean;
  expirationTimestamp: firebase.firestore.Timestamp | null;
}

const Countdown: FC<CountdownProps> = (props) => {
  const { timer, isCountdownFinished, expirationTimestamp } = props;

  if (!isCountdownFinished) {
    return <>{timer}</>;
  }
  if (!expirationTimestamp) {
    return null;
  }

  return (
    <TimeAgo
      className={styles.timeAgo}
      milliseconds={expirationTimestamp.seconds * 1000}
    />
  );
};

export default Countdown;
