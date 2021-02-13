import { extendType } from "nexus";
import { CommonType } from '../../commons/types/Common.type';
import { commonDb } from '../../../../../common/database';

export const ProposalCommonExtension = extendType({
  type: 'Proposal',
  definition(t) {
    t.nonNull.field('common', {
      type: CommonType,
      resolve: (root) => {
        return commonDb.get((root as any).commonId);
      },
    });
  }
})