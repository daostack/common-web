import React, { FC } from "react";
import classNames from "classnames";
import firebase from "firebase/app";
import { getTimeAgo } from "./utils";

interface FeedCountdownProps {
  className?: string;
  timeAgoClassName?: string;
  timer?: string;
  isCountdownFinished: boolean;
  expirationTimestamp: firebase.firestore.Timestamp | null;
}

const FeedCountdown: FC<FeedCountdownProps> = (props) => {
  const {
    className,
    timeAgoClassName,
    timer,
    isCountdownFinished,
    expirationTimestamp,
  } = props;

  if (!isCountdownFinished) {
    return <span className={className}>{timer}</span>;
  }
  if (!expirationTimestamp) {
    return null;
  }

  const milliseconds = expirationTimestamp.seconds * 1000;
  const date = new Date(milliseconds);

  return (
    <span
      className={classNames(className, timeAgoClassName)}
      title={`${date.toDateString()} ${date.toTimeString()}`}
    >
      {getTimeAgo(milliseconds)}
    </span>
  );
};

export default FeedCountdown;
