import { createEventCommand } from './commands/createEvent';

export const eventsService = {
  commands: {
    create: createEventCommand
  }
};