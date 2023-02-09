import uniqBy from "lodash/uniqBy";
import { Circle, CircleType } from "../models";

export const removeProjectCircles = <T extends Pick<Circle, "id" | "hierarchy" | "type">>(
  circles: T[] | null
): T[] => {
  return (circles || [])?.filter(({type}) => type !== CircleType.Project);
}

export const filterProjectCircles = (
  circles: Circle[] | null
): Circle[] => {
  return (circles || [])?.filter(({type}) => type === CircleType.Project);
}

export const filterCircleMapNonProjectCircles = <T extends Pick<Circle, "id" | "hierarchy" | "type">>(
  circles: T[],
  circleIds: string[]
): string[] => {
  const nonProjectCirclesIds =  removeProjectCircles(circles).map(({id}) => id);
  return circleIds.filter((id) => nonProjectCirclesIds.includes(id));
}

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

const getCirclesPerTier = <T extends Pick<Circle, "id" | "hierarchy" | "type">>(
  circles: T[],
): Record<number, T[]> =>
  removeProjectCircles(circles).reduce<Record<number, T[]>>((acc, circle) => {
    if (!circle.hierarchy) {
      return acc;
    }

    const currentItem = acc[circle.hierarchy.tier] || [];

    return {
      ...acc,
      [circle.hierarchy.tier]: currentItem.concat(circle),
    };
  }, {});

const getWhereCirclesAreExcluded = <T extends Pick<Circle, "hierarchy" | "type" | "id">>(
  allCircles: T[],
  circlesToCheck: T[],
): T[] =>
  removeProjectCircles(allCircles).filter((circle) =>
    circlesToCheck.some(
      (circleToCheck) =>
        typeof circleToCheck.hierarchy?.tier === "number" &&
        circle.hierarchy?.exclusions.includes(circleToCheck.hierarchy.tier),
    ),
  );

const getExcludedCircles = <T extends Pick<Circle, "id" | "hierarchy" | "type">>(
  allCircles: T[],
  circlesToCheck: T[],
): T[] =>
  removeProjectCircles(allCircles).filter((circle) => {
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

const sortCirclesByTierAscending = <T extends Pick<Circle, "hierarchy" | "type" | "id">>(
  circles: T[],
): T[] =>
  removeProjectCircles([...circles]).sort((prevCircle, nextCircle) => {
    if (!nextCircle.hierarchy) {
      return 1;
    }
    if (!prevCircle.hierarchy) {
      return -1;
    }

    return prevCircle.hierarchy.tier - nextCircle.hierarchy.tier;
  });

export const getCirclesWithHighestTier = <
  T extends Pick<Circle, "id" | "hierarchy" | "type">,
>(
  circles: T[],
): T[] => {
  const finalCircles = removeProjectCircles(circles).filter((circle) => !circle.hierarchy);
  const circlesWithHierarchy = removeProjectCircles(circles).filter((circle) =>
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
  T extends Pick<Circle, "id" | "hierarchy" | "type">,
>(
  circles: T[],
): T[] => {
  const finalCircles = removeProjectCircles(circles).filter((circle) => !circle.hierarchy);
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
  T extends Pick<Circle, "id" | "hierarchy" | "type">,
>(
  currentCircles: T[],
  allCircles: T[],
  allowedCircleIds: string[] = [],
): T[] => {
  const allowedCurrentCircles = removeProjectCircles(currentCircles).filter((circle) =>
    allowedCircleIds.includes(circle.id),
  );

  return removeProjectCircles(allCircles).filter((circleToCheck) => {
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
