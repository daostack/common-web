import { createEventCommand } from './commands/createEvent';

export const eventsService = {
  create: createEventCommand,

  commands: {
    create: createEventCommand
  }
};