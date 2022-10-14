import { Circle } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getCirclesWithLowestTier,
  addCirclesWithHigherTier,
} from "./circles";

describe("circlesHierarchy", () => {
  const CIRCLES: Pick<Circle, "id" | "name" | "hierarchy">[] = [
    { id: "circle-1", name: "Circle 1", hierarchy: null },
    { id: "circle-2", name: "Circle 2", hierarchy: { tier: 0, exclusions: [] } },
    { id: "circle-3", name: "Circle 3", hierarchy: null },
    { id: "circle-4", name: "Circle 4", hierarchy: { tier: 20, exclusions: [] } },
    { id: "circle-5", name: "Circle 5", hierarchy: { tier: 10, exclusions: [] } },
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

  describe("addCirclesWithHigherTier", () => {
    it("should return correct circles", () => {
      const currentCircles = [CIRCLES[2], CIRCLES[4]];
      const expectedResult = [CIRCLES[2], CIRCLES[3], CIRCLES[4]];

      expect(addCirclesWithHigherTier(currentCircles, CIRCLES)).toEqual(
        expectedResult
      );
    });
  });
});
