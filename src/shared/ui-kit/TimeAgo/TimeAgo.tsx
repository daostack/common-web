import React, { FC, useEffect, useState } from "react";
import moment from "moment";
import { getTimeAgo } from "@/shared/utils";

export interface TimeAgoProps {
  className?: string;
  milliseconds: number;
}

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const ONE_WEEK_MS = 7 * ONE_DAY_MS;

/**
 * @param breakpointMinutes – for one hour may be 60, for one day – 24 * 60
 */
const getIntervalFromMinutes = (
  diffInMinutes: number,
  breakpointMinutes: number,
) => {
  const minutesTillBreakpoint =
    breakpointMinutes - (diffInMinutes % breakpointMinutes) + 2;

  return minutesTillBreakpoint * 60 * 1000;
};

const getInterval = (milliseconds: number): number => {
  const date = moment(milliseconds);
  const today = moment();
  const timePassed = today.valueOf() - milliseconds;
  const isLastHour = timePassed <= ONE_HOUR_MS;
  const isLastDay = timePassed <= ONE_DAY_MS;
  const isLastWeek = timePassed <= ONE_WEEK_MS;

  if (isLastHour) {
    return 20000;
  }

  const diffInMinutes = today.diff(date, "minutes");

  if (isLastDay) {
    return getIntervalFromMinutes(diffInMinutes, 60);
  }
  if (isLastWeek) {
    return getIntervalFromMinutes(diffInMinutes, 24 * 60);
  }

  return 0;
};

const TimeAgo: FC<TimeAgoProps> = (props) => {
  const { className, milliseconds } = props;
  const [formattedTime, setFormattedTime] = useState(() =>
    getTimeAgo(milliseconds, { withFormattedTime: false }),
  );
  const date = new Date(milliseconds);

  useEffect(() => {
    let timeoutId;

    const callback = () => {
      setFormattedTime(getTimeAgo(milliseconds, { withFormattedTime: false }));
      const interval = getInterval(milliseconds);

      if (interval) {
        timeoutId = setTimeout(callback, interval);
      }
    };

    callback();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [milliseconds]);

  return (
    <span
      className={className}
      title={`${date.toDateString()} ${date.toTimeString()}`}
    >
      {formattedTime}
    </span>
  );
};

export default TimeAgo;
