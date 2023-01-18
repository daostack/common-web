import React, { FC } from "react";
import firebase from "firebase/app";
import { getTimeAgo } from "./utils";
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

  const milliseconds = expirationTimestamp.seconds * 1000;
  const date = new Date(milliseconds);

  return (
    <span
      className={styles.timeAgo}
      title={`${date.toDateString()} ${date.toTimeString()}`}
    >
      {getTimeAgo(milliseconds)}
    </span>
  );
};

export default Countdown;
