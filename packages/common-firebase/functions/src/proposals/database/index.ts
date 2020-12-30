import { db } from '../../util';
import { Collections } from '../../constants';

import { addProposal } from './addProposal';
import { getProposal } from './getProposal';
import { getProposals } from './getProposals';
import { updateProposal } from './updateProposal';
import { deleteProposalFromDatabase } from './deleteProposal';

import { addVote } from './votes/addVote';
import { getVote } from './votes/getVote';
import { getAllProposalVotes } from './votes/getAllProposalVotes';
import { getFundingRequest } from './getFundingRequest';
import { getJoinRequest } from './getJoinRequest';
import { deleteVoteFromDatabase } from './votes/deleteVote';

export const VotesCollection = db.collection(Collections.Votes);
export const ProposalsCollection = db.collection(Collections.Proposals);

export const proposalDb = {
  addProposal,
  getProposal,
  getFundingRequest,
  getJoinRequest,
  getProposals,
  update: updateProposal,

  delete: deleteProposalFromDatabase
};

export const voteDb = {
  addVote,
  getVote,
  getAllProposalVotes,

  delete: deleteVoteFromDatabase
}