import { EventType } from './Types/Event.type';
import { EventTypeEnum } from './Enums/EventType.enum';
import { EventOrderByInput } from './Inputs/EventOrderByInput';

import { GetEventsQuery } from './Queries/GetEvents.query';
import { EventUserExtension } from './Extensions/EventUser.extension';

export const EventTypes = [
  EventType,
  EventTypeEnum,

  EventOrderByInput,

  EventUserExtension,

  GetEventsQuery
];