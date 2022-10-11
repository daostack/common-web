import { Circle } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getCirclesWithLowestTier,
} from "./circlesHierarchy";

describe("circlesHierarchy", () => {
  const CIRCLES: Pick<Circle, "name" | "hierarchy">[] = [
    { name: "Circle 1", hierarchy: null },
    { name: "Circle 2", hierarchy: { tier: 0, exclusions: [] } },
    { name: "Circle 3", hierarchy: null },
    { name: "Circle 4", hierarchy: { tier: 20, exclusions: [] } },
    { name: "Circle 5", hierarchy: { tier: 10, exclusions: [] } },
  ];

  describe("getCirclesWithHighestTier", () => {
    it("should return correct circles", () => {
      const expectedResult = [CIRCLES[0], CIRCLES[2], CIRCLES[3]];

      expect(getCirclesWithHighestTier(CIRCLES)).toEqual(expectedResult);
    });
  });

  describe("getCirclesWithLowestTier", () => {
    it("should return correct circles", () => {
      const expectedResult = [CIRCLES[0], CIRCLES[2], CIRCLES[1]];

      expect(getCirclesWithLowestTier(CIRCLES)).toEqual(expectedResult);
    });
  });
});
