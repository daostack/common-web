import { EventTypeEnum } from './enums/EventType.enum';
import { EventType } from './types/Event.type';
import { GetEventQuery } from './queries/GetEvent.query';
import { GetEventsQuery } from './queries/GetEvents.query';
import { EventUserExtension } from './extensions/EventUser.extension';

export const EventTypes = [
  EventTypeEnum,

  EventType,

  EventUserExtension,

  GetEventQuery,
  GetEventsQuery
]