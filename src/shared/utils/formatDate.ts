import moment, { Moment } from "moment";
import { DateFormat } from "@/shared/models";

export const formatDate = (
  date: string | Date | Moment,
  format: DateFormat = DateFormat.Short
): string => moment(date).format(format);
