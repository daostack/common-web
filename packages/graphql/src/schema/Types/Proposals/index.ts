import { ProposalType } from './Types/Proposal.type';
import { JoinProposalType } from './Types/JoinProposal.type';
import { FundingProposalType } from './Types/FundingProposal.type';

import { CreateJoinProposalInput, CreateJoinProposalMutation } from './Mutations/CreateJoinProposal.mutation';
import { CreateFundingProposalInput, CreateFundingProposalMutation } from './Mutations/CreateFundingProposal.mutation';

import { ProposalLinkInput } from './Inputs/ProposalLink.input';
import { ProposalFileInput } from './Inputs/ProposalFile.input';
import { ProposalImageInput } from './Inputs/ProposalImage.input';
import { ProposalWhereInput } from './Inputs/ProposalWhere.input';
import { ProposalWhereUniqueInput } from './Inputs/ProposalWhereUnique.input';

import { FinalizeProposalMutation } from './Mutations/FinalizeProposalMutation';

import { ProposalTypeEnum } from './Enums/ProposalType.enum';
import { ProposalStateEnum } from './Enums/ProposalState.enum';

import { GetProposalQuery } from './Queries/GetProposal.query';

import { ProposalDiscussionsExtension } from './Extensions/ProposalDiscussions.extension';

import { ProposalChangeSubscription } from './Subscriptions/ProposalChange.subscription';

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

  ProposalTypeEnum,
  ProposalStateEnum,

  GetProposalQuery,

  ProposalWhereUniqueInput,

  ProposalDiscussionsExtension,

  ProposalChangeSubscription
];