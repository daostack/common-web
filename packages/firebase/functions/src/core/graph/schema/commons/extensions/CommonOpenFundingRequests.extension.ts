import { extendType } from "nexus";

import { proposalDb } from '../../../../../proposals/database';

export const CommonOpenFundingRequestsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.int('openFundingRequests', {
      resolve: async (root) => {
        const openJoinRequest = await proposalDb.getMany({
          type: 'fundingRequest',
          commonId: root.id,
          state: [
            'countdown',
          ],
        });

        return openJoinRequest.length;
      },
    });
  }
})