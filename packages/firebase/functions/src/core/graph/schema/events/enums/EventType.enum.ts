import { enumType } from 'nexus';

import { EVENT_TYPES } from '../../../../../event/event';

export const EventTypeEnum = enumType({
  name: 'EventType',
  members: Object.keys(EVENT_TYPES)
    .map(key => EVENT_TYPES[key])
});
