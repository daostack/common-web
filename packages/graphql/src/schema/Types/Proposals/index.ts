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

import { ProposalStateEnum } from './Enums/ProposalState.enum';
import { ProposalTypeEnum } from './Enums/ProposalType.enum';
import { FundingStateEnum } from './Enums/FundingState.enum';
import { PaymentStateEnum } from './Enums/PaymentState.enum';

import { GetProposalQuery } from './Queries/GetProposal.query';
import { GetProposalsQuery } from './Queries/GetProposals.query';

import { ProposalDiscussionsExtension } from './Extensions/ProposalDiscussions.extension';
import { ProposalFundingExtension } from './Extensions/ProposalFunding.extension';
import { ProposalJoinExtension } from './Extensions/ProposalJoin.extension';

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
  FundingStateEnum,
  PaymentStateEnum,

  GetProposalQuery,
  GetProposalsQuery,

  ProposalWhereUniqueInput,

  ProposalDiscussionsExtension,
  ProposalFundingExtension,
  ProposalJoinExtension,

  ProposalChangeSubscription
];
