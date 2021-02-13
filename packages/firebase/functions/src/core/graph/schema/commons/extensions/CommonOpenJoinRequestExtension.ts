import { extendType } from "nexus";
import { proposalDb } from '../../../../../proposals/database';

export const CommonOpenJoinRequestsExtension = extendType({
  type: 'Common',
  definition(t) {
    t.nonNull.int('openJoinRequests', {
      resolve: async (root) => {
        const openJoinRequest = await proposalDb.getMany({
          type: 'join',
          commonId: root.id,
          state: [
            'countdown',
          ],
        });

        return openJoinRequest.length;
      },
    });

  }
});