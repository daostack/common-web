import { extendType, idArg, nonNull } from "nexus";
import { refreshCommonMembers } from '../../../../../common/business';

export const RefreshCommonMembersMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.int('refreshCommonMembers', {
      description: 'Refresh the common members from the events. Returns the new common member count',
      args: {
        commonId: nonNull(
          idArg({
            description: 'The common id to refresh'
          })
        )
      },
      resolve: (root, args) => {
        return refreshCommonMembers(args.commonId);
      }
    })
  }
})