import { EventHandler } from './index';
import { statisticService } from '@common/core';

export const onFundingRequestCreated: EventHandler = async (data, event) => {
  if (event.type === 'FundingRequestCreated') {
    // Update the statistics
    await statisticService.updateAll({
      fundingProposals: {
        increment: 1
      }
    });
  }
};