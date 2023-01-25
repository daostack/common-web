import React, { FC } from "react";
import firebase from "firebase/app";
import { getTimeAgo } from "./utils";

interface FeedCountdownProps {
  timeAgoClassName?: string;
  timer?: string;
  isCountdownFinished: boolean;
  expirationTimestamp: firebase.firestore.Timestamp | null;
}

const FeedCountdown: FC<FeedCountdownProps> = (props) => {
  const { timeAgoClassName, timer, isCountdownFinished, expirationTimestamp } =
    props;

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
      className={timeAgoClassName}
      title={`${date.toDateString()} ${date.toTimeString()}`}
    >
      {getTimeAgo(milliseconds)}
    </span>
  );
};

export default FeedCountdown;
