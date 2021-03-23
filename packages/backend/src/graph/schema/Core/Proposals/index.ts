import { JoinProposalType } from './Types/JoinProposal.type';
import { FundingProposalType } from './Types/FundingProposal.type';

import { CreateJoinProposalInput, CreateJoinProposalMutation } from './Mutations/CreateJoinProposal.mutation';
import { CreateFundingProposalInput, CreateFundingProposalMutation } from './Mutations/CreateFundingProposal.mutation';

import { ProposalLinkInput } from './Inputs/ProposalLink.input';
import { ProposalFileInput } from './Inputs/ProposalFile.input';
import { ProposalImageInput } from './Inputs/ProposalImage.input';

export const ProposalTypes = [
  JoinProposalType,
  FundingProposalType,

  CreateJoinProposalInput,
  CreateJoinProposalMutation,

  CreateFundingProposalInput,
  CreateFundingProposalMutation,

  ProposalLinkInput,
  ProposalFileInput,
  ProposalImageInput
];