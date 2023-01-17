import React, { FC } from "react";
import firebase from "firebase/app";
import { TimeAgo } from "@/shared/ui-kit";

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

  return <TimeAgo milliseconds={expirationTimestamp.seconds * 1000} />;
};

export default Countdown;
