import { paymentDb } from '../database';
import { proposalDb } from '../../../proposals/database';

export const addCommonIdToPaymentMigration = async (): Promise<void> => {
  // Get all old payments
  const payments = await paymentDb.getMany({
    olderThan: new Date(new Date().setHours(new Date().getHours() - 1)),
    status: ['paid', 'confirmed', 'failed']
  });

  for (const p of payments) {
    if(p.proposalId === 'Payment for deleted subscription') {
      continue;
    }

    try {
      // eslint-disable-next-line no-await-in-loop
      const proposal = await proposalDb.getProposal(p.proposalId);

      // eslint-disable-next-line no-await-in-loop
      await paymentDb.update({
        ...p,
        commonId: proposal.commonId
      } as any);
    } catch (e) {
      logger.error('An error occurred updating payment', {
        payment: p,
        error: e
      })
    }
  }
};