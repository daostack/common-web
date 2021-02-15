import { extendType, nonNull, idArg } from 'nexus';
import { eventsDb } from '../../../../../event/database';
import { EventType } from '../types/Event.type';

export const GetEventQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('event', {
      type: EventType,
      args: {
        eventId: nonNull(idArg())
      },
      resolve: async (root, args) => {
        const event: any = await eventsDb.get(args.eventId);

        event.createdAt = event.createdAt.toDate();
        event.updatedAt = event.updatedAt.toDate();

        return event;
      }
    });
  }
});