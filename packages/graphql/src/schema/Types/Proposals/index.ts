import { JoinProposalType } from './Types/JoinProposal.type';
import { FundingProposalType } from './Types/FundingProposal.type';

import { CreateJoinProposalInput, CreateJoinProposalMutation } from './Mutations/CreateJoinProposal.mutation';
import { CreateFundingProposalInput, CreateFundingProposalMutation } from './Mutations/CreateFundingProposal.mutation';

import { ProposalLinkInput } from './Inputs/ProposalLink.input';
import { ProposalFileInput } from './Inputs/ProposalFile.input';
import { ProposalImageInput } from './Inputs/ProposalImage.input';
import { ProposalWhereInput } from './Inputs/ProposalWhere.input';

import { FinalizeProposalMutation } from './Mutations/FinalizeProposalMutation';

import { ProposalTypeEnum } from './Enums/ProposalType.enum';
import { ProposalType } from './Types/Proposal.type';

export const ProposalTypes = [
  ProposalType,

  JoinProposalType,
  FundingProposalType,

  ProposalWhereInput,
  CreateJoinProposalInput,
  CreateFundingProposalInput,

  FinalizeProposalMutation,
  CreateJoinProposalMutation,
  CreateFundingProposalMutation,

  ProposalLinkInput,
  ProposalFileInput,
  ProposalImageInput,

  ProposalTypeEnum
];