import { CountdownWidth } from "../constants";

const MIN_CONTAINER_WIDTH = 316;

interface ProposalVotingStylesConfiguration {
  columnsAmount: number;
  countdownWidth: CountdownWidth;
  shouldVotersBeShortened: boolean;
}

const getColumnsAmount = (containerWidth: number): number => {
  if (containerWidth < MIN_CONTAINER_WIDTH) {
    return 1;
  }
  if (containerWidth < 576) {
    return 2;
  }

  return 4;
};

const getCountdownWidth = (containerWidth: number): CountdownWidth => {
  if (containerWidth < MIN_CONTAINER_WIDTH) {
    return CountdownWidth.Unset;
  }
  if (containerWidth < 468) {
    return CountdownWidth.Narrow;
  }

  return CountdownWidth.Wide;
};

const checkShouldVotersBeShortened = (containerWidth: number): boolean =>
  containerWidth >= MIN_CONTAINER_WIDTH;

export const getProposalVotingStylesConfiguration = (
  containerWidth = 10000,
): ProposalVotingStylesConfiguration => ({
  columnsAmount: getColumnsAmount(containerWidth),
  countdownWidth: getCountdownWidth(containerWidth),
  shouldVotersBeShortened: checkShouldVotersBeShortened(containerWidth),
});
