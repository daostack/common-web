import { Circle } from "@/shared/models";
import {
  getCirclesWithHighestTier,
  getCirclesWithLowestTier,
  addCirclesWithHigherTier,
} from "./circles";

describe("circlesHierarchy", () => {
  const CIRCLES_WITHOUT_EXCLUSION: Pick<Circle, "id" | "name" | "hierarchy">[] = [
    { id: "circle-0", name: "Circle 0", hierarchy: { tier: 10, exclusions: [] } },
    { id: "circle-1", name: "Circle 1", hierarchy: null },
    { id: "circle-2", name: "Circle 2", hierarchy: { tier: 0, exclusions: [] } },
    { id: "circle-3", name: "Circle 3", hierarchy: null },
    { id: "circle-4", name: "Circle 4", hierarchy: { tier: 20, exclusions: [] } },
    { id: "circle-5", name: "Circle 5", hierarchy: { tier: 10, exclusions: [] } },
    { id: "circle-6", name: "Circle 6", hierarchy: null },
    { id: "circle-7", name: "Circle 7", hierarchy: { tier: 0, exclusions: [] } },
  ];
  const CIRCLES_WITH_EXCLUSION: Pick<Circle, "id" | "name" | "hierarchy">[] = [
    { id: "circle-0", name: "Circle 0", hierarchy: { tier: 10, exclusions: [] } },
    { id: "circle-1", name: "Circle 1", hierarchy: null },
    { id: "circle-2", name: "Circle 2", hierarchy: { tier: 0, exclusions: [] } },
    { id: "circle-3", name: "Circle 3", hierarchy: null },
    { id: "circle-4", name: "Circle 4", hierarchy: { tier: 20, exclusions: [] } },
    { id: "circle-5", name: "Circle 5", hierarchy: { tier: 10, exclusions: [20] } },
    { id: "circle-6", name: "Circle 6", hierarchy: null },
    { id: "circle-7", name: "Circle 7", hierarchy: { tier: 0, exclusions: [] } },
    { id: "circle-8", name: "Circle 8", hierarchy: { tier: 20, exclusions: [] } },
  ];

  describe("getCirclesWithHighestTier", () => {
    it("should return correct circles when there are no circles with hierarchy", () => {
      const circlesToCheck = [
        CIRCLES_WITHOUT_EXCLUSION[1],
        CIRCLES_WITHOUT_EXCLUSION[3],
        CIRCLES_WITHOUT_EXCLUSION[6],
      ];

      expect(getCirclesWithHighestTier(circlesToCheck)).toEqual(circlesToCheck);
    });

    it("should return correct circles when without exclusion", () => {
      const expectedResult = [
        CIRCLES_WITHOUT_EXCLUSION[1],
        CIRCLES_WITHOUT_EXCLUSION[3],
        CIRCLES_WITHOUT_EXCLUSION[6],
        CIRCLES_WITHOUT_EXCLUSION[4],
      ];

      expect(getCirclesWithHighestTier(CIRCLES_WITHOUT_EXCLUSION)).toEqual(expectedResult);
    });

    it("should return correct circles when with exclusions", () => {
      const expectedResult = [
        CIRCLES_WITH_EXCLUSION[1],
        CIRCLES_WITH_EXCLUSION[3],
        CIRCLES_WITH_EXCLUSION[6],
        CIRCLES_WITH_EXCLUSION[5],
        CIRCLES_WITH_EXCLUSION[4],
        CIRCLES_WITH_EXCLUSION[8],
      ];

      expect(getCirclesWithHighestTier(CIRCLES_WITH_EXCLUSION)).toEqual(
        expectedResult
      );
    });
  });

  describe("getCirclesWithLowestTier", () => {
    it("should return correct circles", () => {
      const expectedResult = [CIRCLES_WITHOUT_EXCLUSION[0], CIRCLES_WITHOUT_EXCLUSION[2], CIRCLES_WITHOUT_EXCLUSION[1]];

      expect(getCirclesWithLowestTier(CIRCLES_WITHOUT_EXCLUSION)).toEqual(expectedResult);
    });
  });

  describe("addCirclesWithHigherTier", () => {
    it("should return correct circles", () => {
      const currentCircles = [CIRCLES_WITHOUT_EXCLUSION[2], CIRCLES_WITHOUT_EXCLUSION[4]];
      const expectedResult = [CIRCLES_WITHOUT_EXCLUSION[2], CIRCLES_WITHOUT_EXCLUSION[3], CIRCLES_WITHOUT_EXCLUSION[4]];

      expect(addCirclesWithHigherTier(currentCircles, CIRCLES_WITHOUT_EXCLUSION)).toEqual(
        expectedResult
      );
    });
  });
});
