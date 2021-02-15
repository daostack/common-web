import { objectType } from 'nexus';

import { EventTypeEnum } from '../enums/EventType.enum';

export const EventType = objectType({
  name: 'Event',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The unique identifier of the event'
    });

    t.nonNull.field('type', {
      type: EventTypeEnum,
      description: 'The type of the event'
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