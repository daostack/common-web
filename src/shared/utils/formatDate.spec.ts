import moment from "moment";
import { DateFormat } from "@/shared/models";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("should format date string correctly", () => {
    const date = "2022-04-29T11:25:58.900Z";

    expect(formatDate(date, DateFormat.Long)).toEqual("29-04-2022 11:25");
  });

  it("should format date object correctly", () => {
    const date = new Date(1651234073823);

    expect(formatDate(date, DateFormat.Long)).toEqual("29-04-2022 12:07");
  });

  it("should format moment date correctly", () => {
    const date = moment(1651234073823);

    expect(formatDate(date, DateFormat.Long)).toEqual("29-04-2022 12:07");
  });
});
