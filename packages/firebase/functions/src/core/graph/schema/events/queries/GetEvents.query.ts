import { extendType, intArg, list } from 'nexus';
import { eventsDb } from '../../../../../event/database';

import { EventType } from '../types/Event.type';

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
        })
      },
      resolve: (root, args) => {
        return eventsDb.getMany({
          last: args.last,
          after: args.after
        });
      }
    });
  }
});
