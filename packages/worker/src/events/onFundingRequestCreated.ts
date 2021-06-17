import { EventHookHandler } from './index';
import { statisticService } from '@common/core';

export const onFundingRequestCreated: EventHookHandler = async (data, event) => {
  if (event.type === 'FundingRequestCreated') {
    // Update the statistics
    await statisticService.updateAll({
      fundingProposals: {
        increment: 1
      }
    });
  }
};