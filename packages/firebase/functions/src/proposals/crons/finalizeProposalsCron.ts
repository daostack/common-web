import * as functions from 'firebase-functions';

import { proposalDb } from '../database';
import { isExpired } from '../business/isExpired';
import { finalizeProposal } from '../business/finalizeProposal';


export const finalizeProposals = functions.pubsub
  .schedule('*/5 * * * *') // At every 5th minute
  .onRun(async () => {
    const proposals = await proposalDb.getMany({ state: 'countdown' });

    const promiseArray: Promise<void>[] = [];

    for (const proposal of proposals) {
      // eslint-disable-next-line no-loop-func
      promiseArray.push((async () => {
        if (await isExpired(proposal)) {
          logger.info(`Finalizing expired proposal with id ${proposal.id}`, {
            proposal
          });

          await finalizeProposal(proposal);
        }
      })());
    }

    await Promise.all(promiseArray);
  });
