import moment from "moment";
import { DateFormat } from "@/shared/models";
import { formatDate } from "@/shared/utils";

export const getTimeAgo = (milliseconds: number): string => {
  const date = moment(milliseconds);
  const today = moment();
  const isToday = today.isSame(date, "day");

  return isToday
    ? `${formatDate(date, DateFormat.GeneralTime)} today`
    : formatDate(date, DateFormat.ShortSecondary);
};
