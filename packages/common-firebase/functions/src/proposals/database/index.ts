import { db } from '../../util';
import { Collections } from '../../constants';

import { addProposal } from './addProposal';

export const proposalsCollection = db.collection(Collections.Proposals);

export const proposalDb = {
  addProposal
};