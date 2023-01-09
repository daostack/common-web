import moment, { Moment } from "moment";

const TIME_FORMAT = "HH:mm";

const getTodayTimeAgo = (date: Moment, today: Moment): string => {
  const hoursDiff = today.diff(date, "hours");

  if (hoursDiff > 0) {
    return `${hoursDiff}h ago`;
  }

  const minutesDiff = today.diff(date, "minutes");

  if (minutesDiff > 0) {
    return `${minutesDiff}m ago`;
  }

  return "a few seconds ago";
};

export const getTimeAgo = (
  milliseconds: number,
  options: { withFormattedTime?: boolean } = {},
): string => {
  const { withFormattedTime = true } = options;
  const date = moment(milliseconds);
  const today = moment();
  const daysDiff = today.diff(date, "days");

  if (daysDiff === 0) {
    return getTodayTimeAgo(date, today);
  }

  const formattedTime = date.format(TIME_FORMAT);
  const formattedTimeWithComma = withFormattedTime ? `, ${formattedTime}` : "";

  if (daysDiff === 1) {
    return `Yesterday${formattedTimeWithComma}`;
  }
  if (daysDiff < 7) {
    return `${date.format("dddd")}${formattedTimeWithComma}`;
  }

  const yearsDiff = today.diff(date, "years");

  if (yearsDiff === 0) {
    return `${date.format("MMM D")}${formattedTimeWithComma}`;
  }

  return `${date.format("MMM D, YYYY")}${formattedTimeWithComma}`;
};
