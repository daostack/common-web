import { Event } from '@prisma/client';
import { createEventNotificationCommand } from './createEventNotificationCommand';

export const processEventCommand = async (event: Event): Promise<void> => {
  await createEventNotificationCommand(event);
};