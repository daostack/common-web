import { objectType, enumType, extendType, nonNull, idArg, list, intArg } from 'nexus';
import { EVENT_TYPES } from '../../../event/event';
import { eventsDb } from '../../../event/database';
import { convertTimestampToDate } from '../../../util';

export const EventTypeEnum = enumType({
  name: 'EventType',
  members: Object.keys(EVENT_TYPES)
    .map(key => EVENT_TYPES[key])
});

export const EventType = objectType({
  name: 'Event',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The unique identifier of the event'
    });

    t.nonNull.field('type', {
      type: EventTypeEnum
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the event was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the event was last updated'
    });

    // Relationships
    t.id('objectId', {
      description: 'The id of the object on which was acted to created the event'
    });

    t.id('userId', {
      description: 'The id of the actor'
    });
  }
});

export const EventTypeQueryExtensions = extendType({
  type: 'Query',
  definition(t) {
    t.field('event', {
      type: EventType,
      args: {
        eventId: nonNull(idArg())
      },
      resolve: async (root, args, ctx) => {
        const event: any = await eventsDb.get(args.eventId);

        event.createdAt = event.createdAt.toDate();
        event.updatedAt = event.updatedAt.toDate();

        return event;
      }
    });

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
