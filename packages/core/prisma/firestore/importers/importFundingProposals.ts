import { db } from '../firestore';
import { seeder } from '../../seed';
import { IFundingRequestProposal, FundingRequestState } from '@common/types';
import { FundingState, ProposalState, ProposalType } from '@prisma/client';

const transformState = (state: FundingRequestState): ProposalState => {
  switch (state) {
    case 'failed':
      return ProposalState.Rejected;
    case 'passed':
    case 'passedInsufficientBalance':
      return ProposalState.Accepted;
    case 'countdown':
      return ProposalState.Countdown;
  }
};

export const importFundingProposals = async () => {
  const ProposalsCollection = db.collection('proposals');

  const firebaseFundingProposals = (await ProposalsCollection
    .where('type', '==', 'fundingRequest').get())
    .docs.map(e => e.data());

  for (const fp of firebaseFundingProposals as IFundingRequestProposal[]) {
    console.log('Importing proposal');

    try {
      const ifp = await seeder.proposal
        .create({
          data: {
            common: {
              connect: {
                id: fp.commonId
              }
            },

            commonMember: {
              connect: {
                userId_commonId: {
                  userId: fp.proposerId,
                  commonId: fp.commonId
                }
              }
            },

            user: {
              connect: {
                id: fp.proposerId
              }
            },

            type: ProposalType.FundingRequest,

            title: (fp.description as any).title,
            description: (fp.description as any).description,

            files: (fp.description as any)?.files.map((f: any) => ({
              value: f.value
            })),

            images: (fp.description as any)?.images.map((f: any) => ({
              value: f.value
            })),

            links: (fp.description as any)?.links.map((f: any) => ({
              title: f.title || '',
              url: f.value
            })),

            state: transformState(fp.state),

            expiresAt:
              new Date(
                fp.createdAt.toDate().getTime() +
                fp.countdownPeriod * 1000
              ),

            votesFor: fp.votesFor,
            votesAgainst: fp.votesAgainst,

            funding: {
              create: {
                fundingState: FundingState.NotEligible,
                amount: fp.fundingRequest.amount
              }
            }
          }
        });

      console.log('Imported proposal');
    } catch (e) {
      console.log('Failed importing funding request', e);
    }
  }
};