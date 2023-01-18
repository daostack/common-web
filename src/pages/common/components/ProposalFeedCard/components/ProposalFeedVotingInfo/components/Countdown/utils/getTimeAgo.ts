import moment from "moment";
import { DateFormat } from "@/shared/models";
import { formatDate } from "@/shared/utils";

export const getTimeAgo = (milliseconds: number): string => {
  const date = moment(milliseconds);
  const today = moment();
  const isToday = today.isSame(date, "day");

  if (isToday) {
    return formatDate(date, DateFormat.GeneralTime);
  }

  const yesterday = moment().subtract(1, "day");
  const isYesterday = yesterday.isSame(date, "day");

  return isYesterday
    ? "yesterday"
    : formatDate(date, DateFormat.ShortSecondary);
};
