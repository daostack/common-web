import { IProposalEntity, IVoteEntity } from '@common/types';

import { Collections } from '../../constants';
import { db } from '../../util';

import { addProposal } from './addProposal';
import { deleteProposalFromDatabase } from './deleteProposal';
import { getFundingRequest } from './getFundingRequest';
import { getJoinRequest } from './getJoinRequest';
import { getProposal, getProposalTransactional } from './getProposal';
import { getProposals } from './getProposals';
import { updateProposal, updateProposalTransactional } from './updateProposal';
import { moderateProposal } from './moderateProposal';

import { addVote } from './votes/addVote';
import { deleteVoteFromDatabase } from './votes/deleteVote';
import { getAllProposalVotes } from './votes/getAllProposalVotes';
import { getVote } from './votes/getVote';

export const VotesCollection = db.collection(Collections.Votes)
  .withConverter<IVoteEntity>({
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): IVoteEntity {
      return snapshot.data() as IVoteEntity;
    },
    toFirestore(object: IVoteEntity | Partial<IVoteEntity>): FirebaseFirestore.DocumentData {
      return object;
    }
  });

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
  getMany: getProposals,
  update: updateProposal,
  moderateProposal,

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