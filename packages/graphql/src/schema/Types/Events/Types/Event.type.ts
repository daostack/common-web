import { objectType } from 'nexus';

export const EventType = objectType({
  name: 'Event',
  definition(t) {
    t.nonNull.id('id', {
      description: 'The main identifier of the item'
    });

    t.nonNull.date('createdAt', {
      description: 'The date, at which the item was created'
    });

    t.nonNull.date('updatedAt', {
      description: 'The date, at which the item was last modified'
    });

    t.nonNull.field('type', {
      type: 'EventType',
      description: 'The type of the event in one of the predefined event types'
    });

    t.id('userId', {
      description: 'The ID of the event creator'
    });

    t.id('commonId', {
      description: 'The ID of the common, for whom the event was created'
    });
  }
});