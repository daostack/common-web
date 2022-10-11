import { Circles } from "@/shared/models";
import { BaseProposal } from "@/shared/models/governance/proposals";
import { getCirclesWithLowestTier } from "@/shared/utils";

export const generateCirclesBinaryNumber = (circles: number[]) => {
  const circlesSet = new Set(circles);

  let binary = '';

  for (let i = 0; i < 32; i++) {
    binary = `${binary}${circlesSet.has(i) ? "1" : "0"}`
  }

  return parseInt(binary, 2);
}

export const calculateVoters = (
  weights: BaseProposal["global"]["weights"],
  circles?: Circles
) => {
  const filteredCircles = circles
    ? Object.entries(circles)
        .filter(([circleIndex]) =>
          weights?.some(
            ({ circles }) =>
              circles.bin & generateCirclesBinaryNumber([Number(circleIndex)])
          )
        )
        .map(([, circle]) => circle)
    : [];

  return getCirclesWithLowestTier(filteredCircles).map(({ name }) => name);
};


export const numberToBinary = (n: number) => {
  const padding = '0'.repeat(Math.clz32(n));
  return padding + (n >>> 0).toString(2)
}
