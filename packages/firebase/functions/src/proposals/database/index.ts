import { db } from '../../util';
import { Collections } from '../../constants';

import { addProposal } from './addProposal';
import { getProposal, getProposalTransactional } from './getProposal';
import { getProposals } from './getProposals';
import { updateProposal, updateProposalTransactional } from './updateProposal';
import { deleteProposalFromDatabase } from './deleteProposal';

import { addVote } from './votes/addVote';
import { getVote } from './votes/getVote';
import { getAllProposalVotes } from './votes/getAllProposalVotes';
import { getFundingRequest } from './getFundingRequest';
import { getJoinRequest } from './getJoinRequest';
import { deleteVoteFromDatabase } from './votes/deleteVote';

import { IProposalEntity } from '../proposalTypes';

export const VotesCollection = db.collection(Collections.Votes);

export const ProposalsCollection = db.collection(Collections.Proposals)
  .withConverter<IProposalEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IProposalEntity {
      return snapshot.data() as IProposalEntity;
    },
    toFirestore(object: IProposalEntity | Partial<IProposalEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

export const proposalDb = {
  addProposal,
  getProposal,
  getFundingRequest,
  getJoinRequest,
  getProposals,
  update: updateProposal,

  delete: deleteProposalFromDatabase,

  transactional: {
    get: getProposalTransactional,
    update: updateProposalTransactional
  }
};

export const voteDb = {
  addVote,
  getVote,
  getAllProposalVotes,

  delete: deleteVoteFromDatabase
};