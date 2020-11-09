import { db } from '../../util';
import { Collections } from '../../constants';

import { addProposal } from './addProposal';
import { getProposal } from './getProposal';
import { updateProposal } from './updateProposal';

export const proposalsCollection = db.collection(Collections.Proposals);

export const proposalDb = {
  addProposal,
  getProposal,
  updateProposal
};