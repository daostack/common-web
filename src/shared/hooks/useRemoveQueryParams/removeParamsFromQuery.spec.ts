import { removeParamsFromQuery } from "./removeParamsFromQuery";

describe("removeParamsFromQuery", () => {
  describe("for single key", () => {
    it("should not change query at all when key is not met", () => {
      expect(removeParamsFromQuery("?param=code", "searchedParam")).toEqual(
        "?param=code"
      );
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", "searchedParam")
      ).toEqual("?param1=value1&param2=value2");
    });

    it("should remove specified param", () => {
      expect(removeParamsFromQuery("?param=code", "param")).toEqual("");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", "param1")
      ).toEqual("?param2=value2");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", "param2")
      ).toEqual("?param1=value1");
      expect(
        removeParamsFromQuery(
          "?param1=value1&param2=value2&param3=value3",
          "param2"
        )
      ).toBeOneOf([
        "?param1=value1&param3=value3",
        "?param3=value3&param1=value1",
      ]);
    });
  });

  describe("for multiple keys", () => {
    it("should not change query at all when keys are not met", () => {
      expect(
        removeParamsFromQuery("?param1=value1", [
          "searchedParam1",
          "searchedParam2",
        ])
      ).toEqual("?param1=value1");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", [
          "searchedParam1",
          "searchedParam2",
        ])
      ).toEqual("?param1=value1&param2=value2");
    });

    it("should remove specified params", () => {
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", ["param2"])
      ).toEqual("?param1=value1");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2", [
          "param2",
          "param1",
        ])
      ).toEqual("");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2&param3=value3", [
          "param2",
          "param1",
        ])
      ).toEqual("?param3=value3");
      expect(
        removeParamsFromQuery("?param1=value1&param2=value2&param3=value3", [
          "param1",
          "param3",
        ])
      ).toEqual("?param2=value2");
      expect(
        removeParamsFromQuery(
          "?param1=value1&param2=value2&param3=value3&param4=value4",
          ["param1", "param3", "param4"]
        )
      ).toEqual("?param2=value2");
    });
  });
});
