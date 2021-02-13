import { ProposalTypeEnum } from './enums/ProposalType.enum';
import { ProposalStateEnum } from './enums/ProposalState.enum';
import { ProposalPaymentStateEnum } from './enums/ProposalPaymentState.enum';
import { ProposalVoteOutcomeEnum } from './enums/ProposalVoteOutcome.enum';

import { ProposalType } from './types/Proposal.type';
import { ProposalJoinType } from './types/ProposalJoin.type';
import { ProposalVoteType } from './types/ProposalVote.type';
import { ProposalFundingType } from './types/ProposalFunding.type';
import { ProposalDescriptionType } from './types/ProposalDescription.type';

import { GetProposalQuery } from './queries/GetProposal.query';

import { ProposalCommonExtension } from './extensions/ProposalCommon.extension';
import { ProposalProposerExtension } from './extensions/ProposalProposer.extension';
import { ProposalVoteVoterExtension } from './extensions/ProposalVoteVoter.extension';

export const ProposalTypes = [
  ProposalTypeEnum,
  ProposalStateEnum,
  ProposalVoteOutcomeEnum,
  ProposalPaymentStateEnum,

  ProposalType,
  ProposalDescriptionType,
  ProposalFundingType,
  ProposalJoinType,
  ProposalVoteType,

  GetProposalQuery,

  ProposalCommonExtension,
  ProposalProposerExtension,
  ProposalVoteVoterExtension
];