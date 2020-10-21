import * as functions from 'firebase-functions';
import { createPayment } from './createPayment';
import { PROPOSAL_TYPE } from '../settings';

// needs to be tested on local db
exports.watchForExecutedProposals = functions.firestore
	.document('/proposals/{id}')
  .onUpdate(async (change) => {
    const proposal = change.after.data();
    const previousProposal = change.before.data();
    if (proposal.executed !== previousProposal.executed
      && proposal.executed === true
      && proposal.winningOutcome === 1
      && proposal.type === PROPOSAL_TYPE.Join) {

      console.log(
        'Proposal EXECUTED and WINNING OUTCOME IS 1 -> INITIATING PAYMENT'
      );
        
        await createPayment({
          ipAddress: '127.0.0.1', //@question use public-ip lib here?? 
          proposerId: proposal.proposerId,
          proposalId: proposal.id,
          funding: proposal.description.funding
        });
      }
    }
);