import { db } from '../../util';
import { Collections } from '../../constants';

import { addProposal } from './addProposal';
import { getProposal } from './getProposal';
import { getProposals } from './getProposals';
import { updateProposal } from './updateProposal';

import { addVote } from './votes/addVote';
import { getVote } from './votes/getVote';
import { getAllProposalVotes } from './votes/getAllProposalVotes';

export const votesCollection = db.collection(Collections.Votes);
export const proposalsCollection = db.collection(Collections.Proposals);

export const proposalDb = {
  addProposal,
  getProposal,
  getProposals,
  updateProposal
};

export const voteDb = {
  addVote,
  getVote,
  getAllProposalVotes
}