import { extendType, intArg, list, nonNull } from 'nexus';

import { convertTimestampToDate } from '../../../../../util';
import { eventsDb } from '../../../../../event/database';

import { EventType } from '../types/Event.type';

export const GetEventsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('events', {
      type: list(EventType),
      args: {
        last: nonNull(intArg()),
        after: intArg()
      },
      resolve: async (root, args) => {
        const events = await eventsDb.getMany({
          last: args.last,
          after: args.after
        });

        return events.map(convertTimestampToDate)
      }
    })
  }
});
