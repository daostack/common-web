import React, { FC, useEffect, useState } from "react";
import { getTimeAgo } from "@/shared/utils";

export interface TimeAgoProps {
  className?: string;
  milliseconds: number;
}

const getInterval = (milliseconds: number): number => {
  const currentTime = Date.now();
  const isLastHour = milliseconds >= currentTime - 60 * 60 * 1000;

  return isLastHour ? 20000 : 0;
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
      const interval = getInterval(milliseconds);

      if (interval) {
        setFormattedTime(
          getTimeAgo(milliseconds, { withFormattedTime: false }),
        );
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
