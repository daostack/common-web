import React, { FC, useLayoutEffect } from "react";
import classNames from "classnames";
import { useCountdown } from "@/shared/hooks";
import { formatCountdownValue } from "@/shared/utils";
import "./index.scss";

interface CountDownCardProps {
  className?: string;
  date: Date;
}

const CountDownCard: FC<CountDownCardProps> = (props) => {
  const { className, date } = props;
  const {
    isFinished: isCountdownFinished,
    days,
    hours,
    minutes,
    seconds,
    startCountdown,
  } = useCountdown();
  const daysText = days > 0 ? `${days} Day${days > 1 ? "s " : " "}` : "";
  const timerString = `${daysText}${formatCountdownValue(
    hours
  )}:${formatCountdownValue(minutes)}:${formatCountdownValue(seconds)}`;

  useLayoutEffect(() => {
    startCountdown(date);
  }, [startCountdown, date]);

  return (
    <div className={classNames("proposal-container-countdown-card", className)}>
      <span className="proposal-container-countdown-card__time-title">
        Time to Vote
      </span>
      <p className="proposal-container-countdown-card__timer">{timerString}</p>
      <span className="proposal-container-countdown-card__status-title">
        Voting Status
      </span>
      <p className="proposal-container-countdown-card__status">Passing</p>
    </div>
  );
};

export default CountDownCard;
