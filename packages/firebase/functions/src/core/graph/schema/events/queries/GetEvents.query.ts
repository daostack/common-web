import { arg, extendType, idArg, intArg, list } from 'nexus';
import { eventsDb } from '../../../../../event/database';

import { EventType } from '../types/Event.type';
import { EventTypeEnum } from '../enums/EventType.enum';

export const GetEventsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('events', {
      type: list(EventType),
      args: {
        last: intArg({
          default: 10
        }),
        after: intArg({
          default: 0
        }),

        type: arg({
          type: EventTypeEnum
        }),

        objectId: idArg()
      },
      resolve: (root, args) => {
        return eventsDb.getMany({
          last: args.last,
          after: args.after,

          type: args.type as any,
          objectId: args.objectId
        });
      }
    });
  }
});
