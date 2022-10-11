import { getHighestCircleInHierarchy } from "./getHighestCircleInHierarchy";
import { Circle } from "@/shared/models";

describe("getHighestCircleInHierarchy", () => {
  it("should return correct circles", () => {
    const circles: Pick<Circle, "name" | "hierarchy">[] = [
      { name: "Circle 1", hierarchy: null },
      { name: "Circle 2", hierarchy: { tier: 0, exclusions: [] } },
      { name: "Circle 3", hierarchy: null },
      { name: "Circle 4", hierarchy: { tier: 20, exclusions: [] } },
      { name: "Circle 5", hierarchy: { tier: 10, exclusions: [] } },
    ];
    const expectedResult = [circles[0], circles[2], circles[3]];

    expect(getHighestCircleInHierarchy(circles)).toEqual(expectedResult);
  });
});
