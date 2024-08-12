import uniqBy from "lodash/uniqBy";
import { Circle, CommonFeedType } from "../models";

export const getFilteredByIdCircles = (
  circles: Circle[] | null,
  circleIds: string[] = [],
): Circle[] => {
  if (
    !circles ||
    circles.length === 0 ||
    !circleIds ||
    circleIds.length === 0
  ) {
    return [];
  }

  return circles.filter(({ id }) => circleIds.includes(id));
};

export const getCircleNamesWithSeparator = (
  circles: Circle[] | null,
  separator = ", ",
): string => {
  return circles?.map(({ name }) => name).join(separator) || "";
};

const getCirclesPerTier = <T extends Pick<Circle, "id" | "hierarchy">>(
  circles: T[],
): Record<number, T[]> =>
  circles.reduce<Record<number, T[]>>((acc, circle) => {
    if (!circle.hierarchy) {
      return acc;
    }

    const currentItem = acc[circle.hierarchy.tier] || [];

    return {
      ...acc,
      [circle.hierarchy.tier]: currentItem.concat(circle),
    };
  }, {});

const getWhereCirclesAreExcluded = <T extends Pick<Circle, "hierarchy">>(
  allCircles: T[],
  circlesToCheck: T[],
): T[] =>
  allCircles.filter((circle) =>
    circlesToCheck.some(
      (circleToCheck) =>
        typeof circleToCheck.hierarchy?.tier === "number" &&
        circle.hierarchy?.exclusions.includes(circleToCheck.hierarchy.tier),
    ),
  );

const getExcludedCircles = <T extends Pick<Circle, "id" | "hierarchy">>(
  allCircles: T[],
  circlesToCheck: T[],
): T[] =>
  allCircles.filter((circle) => {
    const tier = circle.hierarchy?.tier;

    return (
      typeof tier === "number" &&
      circlesToCheck.some(
        (circleToCheck) =>
          circle.id !== circleToCheck.id &&
          circleToCheck.hierarchy?.exclusions.includes(tier),
      )
    );
  });

const sortCirclesByTierAscending = <T extends Pick<Circle, "hierarchy">>(
  circles: T[],
): T[] =>
  [...circles].sort((prevCircle, nextCircle) => {
    if (!nextCircle.hierarchy) {
      return 1;
    }
    if (!prevCircle.hierarchy) {
      return -1;
    }

    return prevCircle.hierarchy.tier - nextCircle.hierarchy.tier;
  });

export const getCirclesWithHighestTier = <
  T extends Pick<Circle, "id" | "hierarchy">,
>(
  circles: T[],
): T[] => {
  const finalCircles = circles.filter((circle) => !circle.hierarchy);
  const circlesWithHierarchy = circles.filter((circle) =>
    Boolean(circle.hierarchy),
  );

  if (circlesWithHierarchy.length === 0) {
    return finalCircles;
  }

  const circlesPerTier = getCirclesPerTier(circlesWithHierarchy);
  const [, highestCircles] =
    Object.entries(circlesPerTier).sort(([rawPrevTier], [rawNextTier]) => {
      const prevTier = Number(rawPrevTier);
      const nextTier = Number(rawNextTier);

      return nextTier - prevTier;
    })[0] || [];

  if (!highestCircles) {
    return finalCircles;
  }

  let circlesToCheck: T[] = highestCircles;

  while (circlesToCheck.length > 0) {
    finalCircles.push(...circlesToCheck);
    circlesToCheck = getWhereCirclesAreExcluded(
      circlesWithHierarchy,
      circlesToCheck,
    );
  }

  const uniqueCircles = uniqBy(finalCircles, (circle) => circle.id);

  return sortCirclesByTierAscending(uniqueCircles);
};

export const getCirclesWithLowestTier = <
  T extends Pick<Circle, "id" | "hierarchy">,
>(
  circles: T[],
): T[] => {
  const finalCircles = circles.filter((circle) => !circle.hierarchy);
  const circlesWithHierarchy = circles.filter((circle) =>
    Boolean(circle.hierarchy),
  );

  if (circlesWithHierarchy.length === 0) {
    return finalCircles;
  }

  const circlesPerTier = getCirclesPerTier(circlesWithHierarchy);
  const [, lowestCircles] =
    Object.entries(circlesPerTier).sort(([rawPrevTier], [rawNextTier]) => {
      const prevTier = Number(rawPrevTier);
      const nextTier = Number(rawNextTier);

      return prevTier - nextTier;
    })[0] || [];

  if (!lowestCircles) {
    return finalCircles;
  }

  let circlesToCheck: T[] = lowestCircles;

  while (circlesToCheck.length > 0) {
    finalCircles.push(...circlesToCheck);
    circlesToCheck = getExcludedCircles(circlesWithHierarchy, circlesToCheck);
  }

  const uniqueCircles = uniqBy(finalCircles, (circle) => circle.id);

  return sortCirclesByTierAscending(uniqueCircles);
};

export const addCirclesWithHigherTier = <
  T extends Pick<Circle, "id" | "hierarchy">,
>(
  currentCircles: T[],
  allCircles: T[],
  allowedCircleIds: string[] = [],
): T[] => {
  const allowedCurrentCircles = currentCircles.filter((circle) =>
    allowedCircleIds.includes(circle.id),
  );

  return allCircles.filter((circleToCheck) => {
    const isInCurrentCircles = allowedCurrentCircles.some(
      (circle) => circle.id === circleToCheck.id,
    );
    if (isInCurrentCircles) {
      return true;
    }
    if (!circleToCheck.hierarchy) {
      return false;
    }

    return allowedCurrentCircles.some(
      (circle) =>
        circle.hierarchy &&
        circleToCheck.hierarchy &&
        circle.id !== circleToCheck.id &&
        circle.hierarchy.tier < circleToCheck.hierarchy.tier &&
        !circle.hierarchy.exclusions.includes(circleToCheck.hierarchy.tier),
    );
  });
};

export const checkIsItemVisibleForUser = (data: {
  itemCircleVisibility: string[];
  itemDataType: CommonFeedType;
  userCircleIds: string[];
  itemUserId: string;
  currentUserId?: string;
}): boolean => {
  const {
    itemCircleVisibility,
    itemDataType,
    userCircleIds,
    itemUserId,
    currentUserId,
  } = data;

  if (
    itemCircleVisibility.length <= 0 ||
    itemDataType === CommonFeedType.Project
  ) {
    return true;
  }

  if (itemUserId === currentUserId) {
    return true;
  }

  return itemCircleVisibility.some((circleId) =>
    userCircleIds.includes(circleId),
  );
};
