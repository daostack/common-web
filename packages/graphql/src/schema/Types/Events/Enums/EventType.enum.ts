import { enumType } from 'nexus';
import { EventType } from '@prisma/client';

export const EventTypeEnum = enumType({
  name: 'EventType',
  members: EventType
})