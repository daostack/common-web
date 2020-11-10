import * as functions from 'firebase-functions';

import { proposalDb } from '../database';
import { hasExpired } from '../business/hasExpired';
import { finalizeProposal } from '../business/finalizeProposal';


export const finalizeProposals = functions.pubsub
  .schedule('*/5 * * * *') // At every 5th minute
  .onRun(async () => {
    const proposals = await proposalDb.getProposals({state: 'countdown'});

    const promiseArray: Promise<void>[] = [];

    for (const proposal of proposals) {
      if (await hasExpired(proposal)) {
        promiseArray.push((async () => {
          console.info(`Finalizing expired proposal with id ${proposal.id}`);

          await finalizeProposal(proposal);
        })());
      }
    }
  });
