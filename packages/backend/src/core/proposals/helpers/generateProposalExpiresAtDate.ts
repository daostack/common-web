import { ProposalType } from '@prisma/client';

export const generateProposalExpiresAtDate = (type: ProposalType): Date => {
  const countdownPeriod = Number(
    type === ProposalType.JoinRequest
      ? process.env['Proposals.Join.Countdown']
      : process.env['Proposals.Funding.Countdown']
  );

  return new Date(new Date().getTime() + countdownPeriod);
};