import { db } from '../../../util';
import { Collections } from '../../../constants';

import { addVote } from './addVote';
import { getAllProposalVotes } from './getAllProposalVotes';

export const votesCollection = db.collection(Collections.Votes);

export const voteDb = {
  addVote,
  getAllProposalVotes
}